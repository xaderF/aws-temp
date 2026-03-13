import { useState } from "react";

const iconProtect = "https://placehold.co/96x96/0066CC/ffffff?text=Protect";
const iconPayment = "https://placehold.co/96x96/0066CC/ffffff?text=Pay";
const iconAutoload = "https://placehold.co/96x96/0066CC/ffffff?text=AutoLoad";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const RegisterSection = () => {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Registration failed");
      setSuccess("Account created. You can now sign in.");
      setMode("signin");
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4";
  const labelClass = "block text-sm font-semibold text-foreground mb-1";

  return (
    <section className="bg-background py-10">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-8">Register your Compass Card</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <img src={iconProtect} alt="Balance protection" className="w-24 h-24 mx-auto mb-3 object-contain" />
                <p className="text-sm text-foreground">Protect your balance on a lost or stolen Compass Card.</p>
              </div>
              <div className="text-center">
                <img src={iconPayment} alt="Store payment info" className="w-24 h-24 mx-auto mb-3 object-contain" />
                <p className="text-sm text-foreground">Store your payment info for future purchases.</p>
              </div>
              <div className="text-center">
                <img src={iconAutoload} alt="AutoLoad" className="w-24 h-24 mx-auto mb-3 object-contain" />
                <p className="text-sm text-foreground">Set automatic payments, enroll in the Bike Parkade program, and more.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setMode("register")}
                className="inline-block bg-secondary text-secondary-foreground font-semibold px-10 py-3 rounded-sm text-sm hover:opacity-90 transition-opacity"
              >
                Register
              </button>
            </div>
          </div>

          {/* Right: Sign in / Register */}
          <div className="lg:w-[340px] border border-border rounded-sm p-6 bg-background" id="sign-in">
            <div className="flex border-b border-border mb-4">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}
                className={`px-4 py-2 text-sm font-semibold ${mode === "signin" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                data-mode="register"
                onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                className={`px-4 py-2 text-sm font-semibold ${mode === "register" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Register
              </button>
            </div>

            {mode === "signin" ? (
              <form onSubmit={handleSignIn}>
                <h3 className="text-lg font-bold text-foreground mb-2">Sign in</h3>
                <p className="text-sm text-muted-foreground mb-4">Sign in with your email and password.</p>

                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />

                <label className={labelClass}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />

                {error && <p className="text-sm text-destructive mb-4">{error}</p>}
                {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

                <button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70">
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <h3 className="text-lg font-bold text-foreground mb-2">Create an account</h3>
                <p className="text-sm text-muted-foreground mb-4">Register with your email and password.</p>

                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />

                <label className={labelClass}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} className={inputClass} />

                <label className={labelClass}>Full name (optional)</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" className={inputClass} />

                {error && <p className="text-sm text-destructive mb-4">{error}</p>}
                {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

                <button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70">
                  {loading ? "Creating account..." : "Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
