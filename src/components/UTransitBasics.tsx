import { useState } from "react";

import basicsAutoload from "@/assets/basics-autoload.jpg";
import basicsFares from "@/assets/basics-fares.jpg";
import basicsRefund from "@/assets/basics-refund.jpg";

const tabs = [
  {
    id: "getting-started",
    label: "Getting Started",
    content: {
      text: "UTransit is a student-focused transit experience for UofT. Create your account, verify your student profile, and start buying tickets online.",
      link: { label: "Read quick start", href: "#" },
      image: basicsAutoload,
    },
  },
  {
    id: "tickets",
    label: "Online Tickets",
    content: {
      text: "Buy single-ride and day tickets online. Ticket history and usage are tracked in your account so you always know what is active.",
      link: { label: "View ticket options", href: "#tickets" },
      image: basicsFares,
    },
  },
  {
    id: "tbucks",
    label: "TBucks + ID Swipe",
    content: {
      text: "Load TBucks directly in the app and connect your student ID for swipe-based validation where available during pilot phases.",
      link: { label: "Set up student payment", href: "#sign-in" },
      image: basicsAutoload,
    },
  },
  {
    id: "support",
    label: "Support",
    content: {
      text: "Need help with login, account setup, or ticket issues? Use the support links to contact the UTransit student transit team.",
      link: { label: "Contact support", href: "#support" },
      image: basicsRefund,
    },
  },
];

const UTransitBasics = () => {
  const [activeTab, setActiveTab] = useState("getting-started");
  const active = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section className="bg-card py-10">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">UTransit basics</h2>

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

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-72 flex-shrink-0">
            <img src={active.content.image} alt={active.label} className="w-full rounded-sm" />
          </div>
          <div className="flex-1">
            <p className="text-foreground text-sm leading-relaxed mb-3">{active.content.text}</p>
            <a href={active.content.link.href} className="text-secondary text-sm font-semibold hover:underline">
              {active.content.link.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UTransitBasics;
