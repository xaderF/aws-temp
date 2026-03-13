import { useState } from "react";
import iconProtect from "@/assets/icon-protect.png";
import iconPayment from "@/assets/icon-payment.png";
import iconAutoload from "@/assets/icon-autoload.png";

const RegisterSection = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [accepted, setAccepted] = useState(false);

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

          {/* Right: check balance */}
          <div className="lg:w-[340px] border border-border rounded-sm p-6 bg-background">
            <h3 className="text-lg font-bold text-foreground mb-2">Check your card balance</h3>
            <p className="text-sm text-muted-foreground mb-4">Check balance or load fares as a guest.</p>

            <label className="block text-sm font-semibold text-foreground mb-1">Compass Card number:</label>
            <p className="text-xs text-muted-foreground mb-2">20-digit number on the back of your card.</p>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              maxLength={20}
            />

            <label className="block text-sm font-semibold text-foreground mb-1">Security code:</label>
            <p className="text-xs text-muted-foreground mb-2">3-digit number on the back of your card.</p>
            <input
              type="text"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
              className="w-28 border border-input rounded-sm px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              maxLength={3}
            />

            <div className="flex items-start gap-2 mb-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 accent-primary"
                id="terms"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground">
                I accept the <a href="#" className="text-secondary underline">terms and conditions</a>
              </label>
            </div>

            <button className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity">
              Check balance
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
