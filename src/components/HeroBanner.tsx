import { Link } from "react-router-dom";

import heroTap from "@/assets/hero-tap.png";

const HeroBanner = () => {
  return (
    <section className="bg-card" id="tickets">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 py-10">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Buy UTransit tickets online in seconds
            </h1>
            <p className="text-muted-foreground text-base mb-6 max-w-md">
              Built for UofT students with digital ticket purchase, TBucks loading, and student ID swipe validation.
            </p>
            <Link
              to="/routes"
              className="inline-block bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-sm text-sm hover:opacity-90 transition-opacity"
            >
              Find routes
            </Link>
          </div>
          <div className="flex-shrink-0">
            <img
              src={heroTap}
              alt="UTransit digital ticket preview"
              className="w-64 md:w-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
