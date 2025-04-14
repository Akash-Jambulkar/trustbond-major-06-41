
import Footer from "@/components/Footer";
import AboutHeader from "@/components/about/AboutHeader";
import AboutHero from "@/components/about/AboutHero";
import OurMission from "@/components/about/OurMission";
import HowItWorks from "@/components/about/HowItWorks";
import TeamSection from "@/components/about/TeamSection";
import PartnersSection from "@/components/about/PartnersSection";
import CTASection from "@/components/about/CTASection";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AboutHeader />
      <AboutHero />
      <OurMission />
      <HowItWorks />
      <TeamSection />
      <PartnersSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default About;
