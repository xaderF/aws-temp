import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StudentRegistrationFlow from "@/components/StudentRegistrationFlow";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <StudentRegistrationFlow />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
