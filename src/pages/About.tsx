
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutStats";
import VisionMission from "@/components/about/VisionMission";
import Features from "@/components/about/Features";
import Process from "@/components/about/Process";
import Team from "@/components/about/Team";
import ContactCTA from "@/components/about/ContactCTA";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <VisionMission />
        <Features />
        <Process />
        <Team />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default About;
