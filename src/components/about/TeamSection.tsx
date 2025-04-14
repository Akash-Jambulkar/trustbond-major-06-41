
import { Users, Lock, Building2 } from "lucide-react";

const TeamSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-trustbond-dark mb-4">Our Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            TrustBond is built by a diverse team of experts in blockchain technology, finance, cybersecurity, and regulatory compliance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users size={36} className="text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-1">John Smith</h3>
            <p className="text-trustbond-primary mb-4">CEO & Founder</p>
            <p className="text-gray-700 mb-4">
              Former banking executive with 15+ years of experience in financial technology innovation. John has led digital transformation projects at major banks before founding TrustBond.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Lock size={36} className="text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-1">Sarah Johnson</h3>
            <p className="text-trustbond-primary mb-4">CTO</p>
            <p className="text-gray-700 mb-4">
              Blockchain architect with experience at leading cryptocurrency projects. Sarah's background in cryptography and distributed systems is central to TrustBond's technical foundation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Building2 size={36} className="text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-1">Michael Chen</h3>
            <p className="text-trustbond-primary mb-4">Head of Compliance</p>
            <p className="text-gray-700 mb-4">
              Regulatory expert with experience at major financial institutions and regulatory bodies. Michael ensures that TrustBond adheres to all relevant regulations while pushing innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
