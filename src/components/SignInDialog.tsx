import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type SignInDialogProps = {
  triggerClassName?: string;
  triggerLabel?: string;
  onTriggerClick?: () => void;
};

const inputClass =
  "w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-semibold text-foreground mb-1";

const SignInDialog = ({
  triggerClassName = "",
  triggerLabel = "Sign In",
  onTriggerClick,
}: SignInDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Sign in failed");

      localStorage.setItem("access_token", data.access_token);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={triggerClassName}
          onClick={() => {
            onTriggerClick?.();
          }}
        >
          {triggerLabel}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={12}
        className="w-[min(92vw,380px)] rounded-sm border border-border bg-background p-6 shadow-xl"
      >
        <h3 className="text-2xl font-bold text-foreground mb-2">Sign in</h3>
        <p className="text-base text-muted-foreground mb-4">Use your UTransit student account.</p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className={labelClass}>Student email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@mail.utoronto.ca"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          New student?{" "}
          <Link to="/register" className="text-secondary font-semibold hover:underline" onClick={() => setOpen(false)}>
            Sign up
          </Link>
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default SignInDialog;
