import { useState } from "react";

const iconProtect = "https://placehold.co/96x96/0066CC/ffffff?text=Protect";
const iconPayment = "https://placehold.co/96x96/0066CC/ffffff?text=Pay";
const iconAutoload = "https://placehold.co/96x96/0066CC/ffffff?text=AutoLoad";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const RegisterSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
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
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background py-10">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-8">Register your Compass Card</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: benefits */}
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
              <a
                href="#"
                className="inline-block bg-secondary text-secondary-foreground font-semibold px-10 py-3 rounded-sm text-sm hover:opacity-90 transition-opacity"
              >
                Register
              </a>
            </div>
          </div>

          {/* Right: Sign in */}
          <div className="lg:w-[340px] border border-border rounded-sm p-6 bg-background" id="sign-in">
            <h3 className="text-lg font-bold text-foreground mb-2">Sign in</h3>
            <p className="text-sm text-muted-foreground mb-4">Sign in with your email and password.</p>

            <form onSubmit={handleSignIn}>
              <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              />

              <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              />

              {error && <p className="text-sm text-destructive mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
