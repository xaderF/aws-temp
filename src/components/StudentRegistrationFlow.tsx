import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper, { Step } from "@/components/Stepper";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const inputClass =
  "w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-semibold text-foreground mb-1";

const StudentRegistrationFlow = () => {
  const navigate = useNavigate();

  const [studentNumber, setStudentNumber] = useState("");
  const [utorid, setUtorid] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const [consentProfile, setConsentProfile] = useState(false);
  const [consentPayment, setConsentPayment] = useState(false);
  const [consentSwipe, setConsentSwipe] = useState(false);
  const [tbucksEnabled, setTbucksEnabled] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleCreateAccount = async () => {
    resetMessages();

    if (!consentProfile || !consentPayment) {
      setError("Please accept the required terms to continue.");
      return;
    }

    if (!studentNumber || !utorid || !fullName || !studentEmail) {
      setError("Please complete student number, UTORid, full name, and student email.");
      return;
    }

    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: studentEmail,
          password: registerPassword,
          full_name: fullName,
          student_id: studentNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Registration failed");

      setSuccess("Signup complete. Continue to login.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background py-10" id="register">
      <div className="max-w-[900px] mx-auto px-4">
        <div className="border border-border rounded-sm p-8 bg-background">
          <h2 className="text-3xl font-bold text-foreground mb-3">Student registration</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Complete this 4-step setup to create your UTransit account.
          </p>

          <Stepper
            initialStep={1}
            nextButtonText="Next"
            backButtonText="Previous"
            hideFooterOnLastStep
            onStepChange={resetMessages}
          >
            <Step>
              <h4 className="text-base font-semibold text-foreground">1. Terms and consent</h4>
              <p className="text-sm text-muted-foreground">
                To register, you must allow UTransit to use your UofT identity details and payment profile for ticketing.
              </p>

              <label className="flex items-start gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="mt-1 accent-primary"
                  checked={consentProfile}
                  onChange={(e) => setConsentProfile(e.target.checked)}
                />
                I agree to share my student identity data (student number, UTORid, full name, and student email).
              </label>

              <label className="flex items-start gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="mt-1 accent-primary"
                  checked={consentPayment}
                  onChange={(e) => setConsentPayment(e.target.checked)}
                />
                I agree to payment processing for online ticket purchases and TBucks loading.
              </label>
            </Step>

            <Step>
              <h4 className="text-base font-semibold text-foreground">2. Student information</h4>
              <p className="text-sm text-muted-foreground">Enter your required UofT details.</p>

              <div>
                <label className={labelClass}>Student number</label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="1001234567"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>UTORid</label>
                <input
                  type="text"
                  value={utorid}
                  onChange={(e) => setUtorid(e.target.value)}
                  placeholder="yourutorid"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Student email</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="you@mail.utoronto.ca"
                  className={inputClass}
                />
              </div>
            </Step>

            <Step>
              <h4 className="text-base font-semibold text-foreground">3. Account setup</h4>
              <p className="text-sm text-muted-foreground">Create your login and choose setup preferences.</p>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Confirm password</label>
                <input
                  type="password"
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  className={inputClass}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={tbucksEnabled}
                  onChange={(e) => setTbucksEnabled(e.target.checked)}
                />
                Enable TBucks loading
              </label>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={consentSwipe}
                  onChange={(e) => setConsentSwipe(e.target.checked)}
                />
                Enable student ID swipe validation (pilot)
              </label>
            </Step>

            <Step>
              <h4 className="text-base font-semibold text-foreground">4. Confirmation</h4>
              <p className="text-sm text-muted-foreground">Review and confirm your signup.</p>

              <div className="text-sm text-foreground space-y-1">
                <p><strong>Student number:</strong> {studentNumber || "-"}</p>
                <p><strong>UTORid:</strong> {utorid || "-"}</p>
                <p><strong>Full name:</strong> {fullName || "-"}</p>
                <p><strong>Student email:</strong> {studentEmail || "-"}</p>
                <p><strong>TBucks loading:</strong> {tbucksEnabled ? "Enabled" : "Not enabled"}</p>
                <p><strong>ID swipe validation:</strong> {consentSwipe ? "Enabled" : "Not enabled"}</p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                type="button"
                disabled={loading}
                onClick={handleCreateAccount}
                className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Confirm sign up"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/#sign-in")}
                className="w-full border border-border text-foreground font-semibold py-2.5 rounded-sm text-sm hover:bg-muted transition-colors"
              >
                Go to login
              </button>
            </Step>
          </Stepper>
        </div>
      </div>
    </section>
  );
};

export default StudentRegistrationFlow;
