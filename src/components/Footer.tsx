const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-3">Compass Card</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Sign In</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Register</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Get a Card</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Purchase a Card</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Find a Retailer</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Concession Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Legal</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Compass Card. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
