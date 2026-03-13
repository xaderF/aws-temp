const heroTap =
  "https://placehold.co/320x240/0066CC/ffffff?text=Tap+Card";

const HeroBanner = () => {
  return (
    <section className="bg-card">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 py-10">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Set it and forget it with AutoLoad!
            </h1>
            <p className="text-muted-foreground text-base mb-6 max-w-md">
              Automatically reload your pass or stored value and never worry about having sufficient fare.
            </p>
            <a
              href="#sign-in"
              className="inline-block bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-sm text-sm hover:opacity-90 transition-opacity"
            >
              Sign in
            </a>
          </div>
          <div className="flex-shrink-0">
            <img
              src={heroTap}
              alt="Tap your Compass card at a fare gate"
              className="w-64 md:w-80"
            />
          </div>
        </div>

        {/* Notice bar */}
        <div className="bg-hero-notice text-secondary-foreground px-6 py-3 rounded-sm -mt-2 mb-0">
          <p className="text-sm">
            <strong>Tap your card, not your wallet!</strong> This ensures the credit card in your wallet won't be unintentionally charged.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
