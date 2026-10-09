import SkillCard from "#/components/SkillCard";
import { getSkills } from "#/dataconnect-generated";

import { dataConnect } from "#/lib/firebase";

import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Terminal } from "lucide-react";

const getSkillsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data } = await getSkills(dataConnect, {
      searchTerm: "",
      limit: 10,
    });
    return data.skills;
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => getSkillsFn(),
});

function Home() {
  const skill = Route.useLoaderData();
  return (
    <div id="home">
      <div className="home">
        <section className="hero">
          <div className="copy">
            <h1>
              The Registry for
              <br />
              <span className="text-gradient">Agentic Intellice</span>
            </h1>
            <p>
              A high-perfomance registry for procedural agent skill. Discover,
              publish, and operate reusable agent capabilities workspace.
            </p>
          </div>
          <div className="actions">
            <Link to={"/"} className="btn-primary">
              <Terminal size={18} />
              <span>Browser Registry</span>
            </Link>
            <Link to={"/"} className="btn-secondary">
              Publish Skill
            </Link>
          </div>
        </section>

        <section className="latest">
          <div className=" space-y-2">
            <h2>
              Recently Created <span className="text-gradient">Skills</span>
            </h2>
            <p>
              Latest skills loaded from database in descending creation order.
            </p>
          </div>
          <div className="">
            {skill.length > 0 ? (
              <div className="skills-grid">
                {skill.map((skill) => (
                  <SkillCard key={skill.id} item={skill} />
                ))}
              </div>
            ) : (
              <p>No skills have been created yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
