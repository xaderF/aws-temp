import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-api";
import SignInDialog, { SIGN_IN_OPEN_EVENT } from "@/components/SignInDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const initials = (() => {
    if (!user) return "U";

    const source = user.full_name?.trim() || user.email;
    const parts = source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "");

    if (parts.length === 0) return "U";
    return parts.join("");
  })();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-5 py-3 text-sm font-semibold transition-colors ${
      isActive ? "text-primary-foreground border-b-2 border-primary-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"
    }`;

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <header className="bg-primary">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="text-primary-foreground font-bold text-2xl tracking-tight">
            UTransit
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-primary-foreground/90">
            <a href="/#support" className="hover:text-primary-foreground transition-colors">Support</a>
            {userLoading ? (
              <span className="text-primary-foreground/60 text-sm">Loading...</span>
            ) : user ? (
              <div className="flex items-center gap-3">
                <button onClick={handleSignOut} className="hover:text-primary-foreground transition-colors">
                  Sign Out
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary-foreground/60">
                      <Avatar className="h-8 w-8 border border-primary-foreground/50" title={user.email}>
                        <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tickets">My Tickets</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/routes">Find Ride</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <SignInDialog
                openEventName={SIGN_IN_OPEN_EVENT}
                triggerClassName="rounded-sm border border-primary-foreground/40 px-3 py-1 hover:bg-primary-foreground/10 text-primary-foreground transition-colors"
              />
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
          <NavLink to="/" end className={tabClass}>
            Home
          </NavLink>
          <NavLink to="/routes" className={tabClass}>
            Routes
          </NavLink>
          <NavLink to="/tickets" className={tabClass}>
            Tickets
          </NavLink>
          <NavLink to="/profile" className={tabClass}>
            Profile
          </NavLink>
          <NavLink to="/settings" className={tabClass}>
            Settings
          </NavLink>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 py-2">
            <a href="/#support" className="block py-2 text-primary-foreground text-sm" onClick={() => setMenuOpen(false)}>Support</a>
            <div className="border-t border-primary-foreground/20 mt-2 pt-2">
              <Link to="/" className="block py-2 text-primary-foreground text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/routes" className="block py-2 text-primary-foreground text-sm" onClick={() => setMenuOpen(false)}>
                Routes
              </Link>
              <Link to="/tickets" className="block py-2 text-primary-foreground text-sm" onClick={() => setMenuOpen(false)}>
                Tickets
              </Link>
              <Link to="/profile" className="block py-2 text-primary-foreground text-sm" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/settings" className="block py-2 text-primary-foreground text-sm" onClick={() => setMenuOpen(false)}>
                Settings
              </Link>
              {userLoading ? (
                <span className="text-primary-foreground/60 text-sm py-2 block">Loading...</span>
              ) : user ? (
                <div className="flex items-center gap-2 py-2">
                  <Avatar className="h-7 w-7 border border-primary-foreground/50" title={user.email}>
                    <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button onClick={handleSignOut} className="text-primary-foreground/80 text-sm">Sign Out</button>
                </div>
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
