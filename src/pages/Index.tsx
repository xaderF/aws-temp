import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import RegisterSection from "@/components/RegisterSection";
import RoutesSection from "@/components/RoutesSection";
import MyTripsSection from "@/components/MyTripsSection";
import CompassBasics from "@/components/CompassBasics";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <RegisterSection />
        <RoutesSection />
        <MyTripsSection />
        <CompassBasics />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
