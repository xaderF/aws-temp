import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-api";
import SignInDialog from "@/components/SignInDialog";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <header className="bg-primary">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <a href="/" className="text-primary-foreground font-bold text-2xl tracking-tight">
            UTransit
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-primary-foreground/90">
            <a href="/#routes" className="hover:text-primary-foreground transition-colors">Routes</a>
            <a href="/#tickets" className="hover:text-primary-foreground transition-colors">Tickets</a>
            <a href="/#support" className="hover:text-primary-foreground transition-colors">Support</a>
            {user ? (
              <button onClick={handleSignOut} className="hover:text-primary-foreground transition-colors">
                Sign Out
              </button>
            ) : (
              <SignInDialog triggerClassName="rounded-sm border border-primary-foreground/40 px-3 py-1 hover:bg-primary-foreground/10 text-primary-foreground transition-colors" />
            )}
          </nav>
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-0 border-t border-primary-foreground/20">
          <a href="/" className="px-5 py-3 text-sm font-semibold text-primary-foreground border-b-2 border-primary-foreground">
            Home
          </a>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 py-2">
            <a href="/#routes" className="block py-2 text-primary-foreground text-sm">Routes</a>
            <a href="/#tickets" className="block py-2 text-primary-foreground text-sm">Tickets</a>
            <a href="/#support" className="block py-2 text-primary-foreground text-sm">Support</a>
            <div className="border-t border-primary-foreground/20 mt-2 pt-2">
              <a href="/" className="block py-2 text-primary-foreground text-sm font-semibold">Home</a>
              {user ? (
                <button onClick={handleSignOut} className="block py-2 text-primary-foreground/80 text-sm w-full text-left">Sign Out</button>
              ) : (
                <SignInDialog
                  triggerClassName="block py-2 text-primary-foreground/80 text-sm"
                  onTriggerClick={() => setMenuOpen(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
