import { ClerkProvider, useUser } from "@clerk/tanstack-react-start";
import {
  PostHogErrorBoundary,
  PostHogProvider,
  usePostHog,
} from "@posthog/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useRef } from "react";
import Crosshair from "#/components/Crosshair";
import Navbar from "#/components/Navbar";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Skild -The Registry for Agentic Intelligence",
      },
      {
        title: "description",
        content:
          "Discover, publish, and operate reusable agent capabilities from a router-driven workspace.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

function PostHogRoot({ children }: { children: React.ReactNode }) {
  if (!posthogProjectToken) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      );
    }

    return children;
  }

  if (!posthogHost) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
      );
    }

    return children;
  }

  return (
    <PostHogProvider
      apiKey={posthogProjectToken}
      options={{
        api_host: posthogHost,
        defaults: "2025-05-24",
        capture_exceptions: true,
        debug: import.meta.env.DEV,
        logs: {
          serviceName: "skild-web",
          environment: import.meta.env.MODE,
        },
      }}
    >
      <PostHogIdentity />
      {children}
    </PostHogProvider>
  );
}

function PostHogIdentity() {
  const posthog = usePostHog();
  const { isLoaded, user } = useUser();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      if (identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(user.id, {
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName,
    });
    identifiedUserId.current = user.id;
  }, [isLoaded, posthog, user]);

  return null;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className=" font-sans antialiased wrap-anywhere">
        <ClerkProvider>
          <PostHogRoot>
            <PostHogErrorBoundary>
              <div id="root-layout" className="">
                <header>
                  <div className="frame">
                    <Navbar />
                    <Crosshair />
                    <Crosshair />
                  </div>
                </header>
                <main>
                  <div className="frame">{children}</div>
                </main>
              </div>
              <TanStackDevtools
                config={{
                  position: "bottom-right",
                }}
                plugins={[
                  {
                    name: "Tanstack Router",
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
            </PostHogErrorBoundary>
          </PostHogRoot>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
