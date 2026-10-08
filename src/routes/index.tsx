import SkillCard from "#/components/SkillCard";
import { dummySkills } from "#/lib/dummySkills";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
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
            <Link to={"/skills"} className="btn-primary">
              <Terminal size={18} />
              <span>Browser Registry</span>
            </Link>
            <Link to={"/skills/new"} className="btn-secondary">
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
            {dummySkills.length > 0 ? (
              <div className="skills-grid">
                {dummySkills.map((skill) => (
                  <SkillCard item={skill} key={skill.id} />
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
