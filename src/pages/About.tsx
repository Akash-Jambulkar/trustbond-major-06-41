
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHero from '@/components/about/AboutHero';
import Features from '@/components/about/Features';
import Process from '@/components/about/Process';
import VisionMission from '@/components/about/VisionMission';
import Team from '@/components/about/Team';
import ContactCTA from '@/components/about/ContactCTA';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
