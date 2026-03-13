const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-10" id="support">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-3">UTransit</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="/" className="hover:text-primary-foreground transition-colors">Home</a></li>
              <li><a href="/#sign-in" className="hover:text-primary-foreground transition-colors">Sign In</a></li>
              <li><a href="/register" className="hover:text-primary-foreground transition-colors">Student Registration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Student Transit</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="/#tickets" className="hover:text-primary-foreground transition-colors">Buy Tickets Online</a></li>
              <li><a href="/#sign-in" className="hover:text-primary-foreground transition-colors">Load TBucks</a></li>
              <li><a href="/#sign-in" className="hover:text-primary-foreground transition-colors">Student ID Swipe Setup</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} UTransit · University student transit MVP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
