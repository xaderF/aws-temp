import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-api";

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
            Compass
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-primary-foreground/90">
            <a href="#" className="hover:text-primary-foreground transition-colors">Purchase a Card</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Find a Retailer</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Help</a>
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
          {user ? (
            <button onClick={handleSignOut} className="px-5 py-3 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Sign Out
            </button>
          ) : (
            <>
              <a href="#sign-in" className="px-5 py-3 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Sign In
              </a>
              <a
                href="#sign-in"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector<HTMLButtonElement>('[data-mode="register"]')?.click();
                }}
                className="px-5 py-3 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Register
              </a>
            </>
          )}
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 py-2">
            <a href="#" className="block py-2 text-primary-foreground text-sm">Purchase a Card</a>
            <a href="#" className="block py-2 text-primary-foreground text-sm">Find a Retailer</a>
            <a href="#" className="block py-2 text-primary-foreground text-sm">Help</a>
            <div className="border-t border-primary-foreground/20 mt-2 pt-2">
              <a href="/" className="block py-2 text-primary-foreground text-sm font-semibold">Home</a>
              {user ? (
                <button onClick={handleSignOut} className="block py-2 text-primary-foreground/80 text-sm w-full text-left">Sign Out</button>
              ) : (
                <>
                  <a href="#sign-in" className="block py-2 text-primary-foreground/80 text-sm">Sign In</a>
                  <a
                    href="#sign-in"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      document.querySelector<HTMLButtonElement>('[data-mode="register"]')?.click();
                    }}
                    className="block py-2 text-primary-foreground/80 text-sm"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
