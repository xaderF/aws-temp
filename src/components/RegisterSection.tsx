import { Link } from "react-router-dom";
import SignInDialog from "@/components/SignInDialog";

import iconAutoload from "@/assets/icon-autoload.png";
import iconPayment from "@/assets/icon-payment.png";
import iconProtect from "@/assets/icon-protect.png";

const RegisterSection = () => {
  return (
    <section className="bg-background py-10" id="sign-in">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-8">Student access</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <img src={iconProtect} alt="Secure student account" className="w-24 h-24 mx-auto mb-3 object-contain" />
            <p className="text-sm text-foreground">Secure your student transit account with UofT identity verification.</p>
          </div>
          <div className="text-center">
            <img src={iconPayment} alt="Digital ticket payments" className="w-24 h-24 mx-auto mb-3 object-contain" />
            <p className="text-sm text-foreground">Buy digital tickets online and manage payment methods in one place.</p>
          </div>
          <div className="text-center">
            <img src={iconAutoload} alt="TBucks loading" className="w-24 h-24 mx-auto mb-3 object-contain" />
            <p className="text-sm text-foreground">Load TBucks and use student ID swipe validation where available.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/register"
            className="inline-block bg-secondary text-secondary-foreground font-semibold px-10 py-3 rounded-sm text-sm hover:opacity-90 transition-opacity"
          >
            Create student account
          </Link>

          <div className="mt-3">
            <SignInDialog
              triggerClassName="inline-block border border-border text-foreground font-semibold px-10 py-3 rounded-sm text-sm hover:bg-muted transition-colors"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
