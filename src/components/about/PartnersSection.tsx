
import { Building2, Database, Lock, Shield } from "lucide-react";

const PartnersSection = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-trustbond-dark mb-4">Our Technology</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            We leverage cutting-edge blockchain technology and security protocols to ensure the highest standards of data protection and verification.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
            <div className="text-center">
              <Database size={36} className="text-trustbond-primary mx-auto mb-2" />
              <p className="font-semibold text-trustbond-dark">Blockchain Technology</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
            <div className="text-center">
              <Lock size={36} className="text-trustbond-secondary mx-auto mb-2" />
              <p className="font-semibold text-trustbond-dark">Advanced Encryption</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
            <div className="text-center">
              <Shield size={36} className="text-trustbond-accent mx-auto mb-2" />
              <p className="font-semibold text-trustbond-dark">Data Protection</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
            <div className="text-center">
              <Building2 size={36} className="text-trustbond-primary mx-auto mb-2" />
              <p className="font-semibold text-trustbond-dark">Smart Contracts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
