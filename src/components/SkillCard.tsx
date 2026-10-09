import type { GetSkillsData } from "#/dataconnect-generated";
import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";
import { getCryptoAvatarUrl } from "../lib/avatar";
import {
  ArrowBigUp,
  ArrowUpRight,
  Bookmark,
  Check,
  Copy,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

type Props = {
  item: GetSkillsData["skills"][number];
};

const SkillCard = ({ item }: Props) => {
  const posthog = usePostHog();
  const [copied, setCopied] = useState(false);
  const category = item.tags[0] ?? "Genaral";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.installCommand);
      posthog.capture("skill_install_command_copied", {
        skill_id: item.id,
        skill_category: category,
        tag_count: item.tags.length,
      });
      posthog.logger.info("install_command_copied", {
        skill_id: item.id,
        skill_category: category,
        tag_count: item.tags.length,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      posthog.logger.warn("install_command_copy_failed", {
        skill_category: category,
      });
      setCopied(false);
    }
  };

  return (
    <article className="skill-card">
      <Link
        to="/"
        tabIndex={-1}
        aria-label={`Open ${item.title}`}
        className=" overlay"
      />
      <div className="chrome">
        <div className="chrome-bar">
          <div className="lights">
            <div className="light red" />
            <div className="light amber" />
            <div className="light green" />
          </div>
          <div className="host">registry.sh</div>
        </div>
      </div>
      <div className="body">
        <div className="meta">
          <div className="author">
            <img
              src={
                item.author.imageUrl || getCryptoAvatarUrl(item.author.clerkId)
              }
              alt={`${item.author.unsername} avatar`}
              className="avatar"
            />
            <div className="author-copy">
              <p>{item.author.unsername || "IA User"}</p>
              <p>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>
          <p className="category">{category}</p>
        </div>
        <div className="sumary">
          <Link to="." className="title-link">
            <h3>{item.title}</h3>
          </Link>
          <p>{item.description}</p>
        </div>
        <div className="command">
          <div className="command-copy">
            <span>{">_"}</span>
            <p>{item.installCommand}</p>
          </div>
          <button
            type="button"
            className="copy"
            onClick={handleCopy}
            disabled={copied}
            aria-label={copied ? "Copied!" : "Copy install command"}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="footer">
          <div className="stats">
            <button type="button" className="upvote" disabled>
              <ArrowBigUp size={16} fill="currentColor" />
              <span>{item.tags.length}</span>
            </button>

            <div className="comments">
              <MessageSquare size={14} />
              <span>{item.author.email ? 1 : 0}</span>
            </div>
          </div>
          <div className="actions">
            <Link to="." className="open" title={`Open ${item.title}`}>
              <span>Open</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              type="button"
              className="save"
              aria-label="Saved state"
              disabled
            >
              <Bookmark size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkillCard;
