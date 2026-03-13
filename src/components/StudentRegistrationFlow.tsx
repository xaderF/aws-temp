import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper, { Step } from "@/components/Stepper";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const inputClass =
  "w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-semibold text-foreground mb-1";

const StudentRegistrationFlow = () => {
  const navigate = useNavigate();

  const [isStudent, setIsStudent] = useState<boolean | null>(null);
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

    if (isStudent === null) {
      setError("Please select whether you're a student.");
      return;
    }

    if (!consentProfile || !consentPayment) {
      setError("Please accept the required terms to continue.");
      return;
    }

    if (!fullName || !studentEmail) {
      setError("Please complete full name and email.");
      return;
    }
    if (isStudent && (!studentNumber || !utorid)) {
      setError("Please complete student number and UTORid.");
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
          student_id: isStudent ? studentNumber : undefined,
          utorid: isStudent ? (utorid || undefined) : undefined,
          is_student: isStudent ?? true,
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
          <h2 className="text-3xl font-bold text-foreground mb-3">Create account</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Complete this 5-step setup to create your UTransit account.
          </p>

          <Stepper
            initialStep={1}
            nextButtonText="Next"
            backButtonText="Previous"
            hideFooterOnLastStep
            onStepChange={resetMessages}
          >
            <Step>
              <h4 className="text-base font-semibold text-foreground">1. Account type</h4>
              <p className="text-sm text-muted-foreground mb-4">Are you a UofT student?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="isStudent"
                    className="accent-primary"
                    checked={isStudent === true}
                    onChange={() => setIsStudent(true)}
                  />
                  Yes, I&apos;m a student
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="isStudent"
                    className="accent-primary"
                    checked={isStudent === false}
                    onChange={() => setIsStudent(false)}
                  />
                  No, I&apos;m not a student
                </label>
              </div>
            </Step>

            <Step>
              <h4 className="text-base font-semibold text-foreground">2. Terms and consent</h4>
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
                {isStudent
                  ? "I agree to share my student identity data (student number, UTORid, full name, and student email)."
                  : "I agree to share my account details (name and email) for ticketing."}
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
              <h4 className="text-base font-semibold text-foreground">3. {isStudent ? "Student " : ""}Information</h4>
              <p className="text-sm text-muted-foreground">
                {isStudent ? "Enter your required UofT details." : "Enter your account details."}
              </p>

              {isStudent && (
                <>
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
                </>
              )}

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
                <label className={labelClass}>{isStudent ? "Student email" : "Email"}</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder={isStudent ? "you@mail.utoronto.ca" : "you@example.com"}
                  className={inputClass}
                />
              </div>
            </Step>

            <Step>
              <h4 className="text-base font-semibold text-foreground">4. Account setup</h4>
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

              {isStudent && (
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={consentSwipe}
                    onChange={(e) => setConsentSwipe(e.target.checked)}
                  />
                  Enable student ID swipe validation (pilot)
                </label>
              )}
            </Step>

            <Step>
              <h4 className="text-base font-semibold text-foreground">5. Confirmation</h4>
              <p className="text-sm text-muted-foreground">Review and confirm your signup.</p>

              <div className="text-sm text-foreground space-y-1">
                <p><strong>Account type:</strong> {isStudent ? "Student" : "Non-student"}</p>
                {isStudent && (
                  <>
                    <p><strong>Student number:</strong> {studentNumber || "-"}</p>
                    <p><strong>UTORid:</strong> {utorid || "-"}</p>
                  </>
                )}
                <p><strong>Full name:</strong> {fullName || "-"}</p>
                <p><strong>Email:</strong> {studentEmail || "-"}</p>
                <p><strong>TBucks loading:</strong> {tbucksEnabled ? "Enabled" : "Not enabled"}</p>
                {isStudent && <p><strong>ID swipe validation:</strong> {consentSwipe ? "Enabled" : "Not enabled"}</p>}
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
