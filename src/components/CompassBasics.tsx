import { useState } from "react";
import basicsAutoload from "@/assets/basics-autoload.jpg";
import basicsFares from "@/assets/basics-fares.jpg";
import basicsRefund from "@/assets/basics-refund.jpg";

const tabs = [
  {
    id: "new",
    label: "New to Compass",
    content: {
      text: "Compass is convenient, easy-to-use and secure – and it's all of these things right in the palm of your hand. Load fare products onto one card, and tap in and out across the entire system.",
      link: { label: "Let's get you introduced.", href: "#" },
      image: basicsAutoload,
    },
  },
  {
    id: "autoload",
    label: "AutoLoad",
    content: {
      text: "With card registration, you can set automatic top-ups or pass renewals. Card registration also includes balance protection, in case your card is lost or stolen.",
      link: { label: "Register and set up your AutoLoad.", href: "#" },
      image: basicsAutoload,
    },
  },
  {
    id: "fares",
    label: "Fares & Passes",
    content: {
      text: "There are two types of Compass Cards – Adult and Concession. You can load Stored Value, a Monthly Pass or a Day Pass onto a Compass Card.",
      link: { label: "Learn which product is right for you.", href: "#" },
      image: basicsFares,
    },
  },
  {
    id: "refund",
    label: "Request a Refund",
    content: {
      text: "Refunds can be made by calling Compass Customer Service at 604-398-2042. Visit our Help page for more information, including options to submit a request either in-person or by mail.",
      link: { label: "Visit Help page.", href: "#" },
      image: basicsRefund,
    },
  },
];

const CompassBasics = () => {
  const [activeTab, setActiveTab] = useState("new");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="bg-card py-10">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Compass basics</h2>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-72 flex-shrink-0">
            <img
              src={active.content.image}
              alt={active.label}
              className="w-full rounded-sm"
            />
          </div>
          <div className="flex-1">
            <p className="text-foreground text-sm leading-relaxed mb-3">
              {active.content.text}
            </p>
            <a href={active.content.link.href} className="text-secondary text-sm font-semibold hover:underline">
              {active.content.link.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompassBasics;
