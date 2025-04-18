
import { Shield, FileText, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const Process = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <SectionHeading 
          title="How TrustBond Works" 
          subtitle="Our platform connects individuals, banks, and blockchain technology to create a seamless verification and lending ecosystem."
          centered={true}
        />
        
        <div className="grid md:grid-cols-3 gap-10 mt-12">
          <div className="text-center">
            <div className="bg-trustbond-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Document Submission</h3>
            <p className="text-gray-600">
              Users securely upload their KYC documents through the platform. The documents are hashed and encrypted before storage.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-trustbond-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-trustbond-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Verification by Banks</h3>
            <p className="text-gray-600">
              Authorized banks verify the submitted documents and record the verification status on the blockchain.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-trustbond-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-trustbond-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Trust Score Generation</h3>
            <p className="text-gray-600">
              Based on verified data, machine learning algorithms calculate a trust score that serves as a measure of creditworthiness.
            </p>
          </div>
        </div>
        
        <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Technical Implementation</h3>
          <p className="text-gray-700 mb-4">
            TrustBond is built on a robust technology stack that includes:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <div className="mt-1 mr-2 text-trustbond-primary">•</div>
              <span><strong>Backend:</strong> Node.js/Express and Python/Flask for handling KYC data requests and processing</span>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 text-trustbond-primary">•</div>
              <span><strong>Blockchain Integration:</strong> Web3.js/Ethers.js for blockchain interactions and smart contracts</span>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 text-trustbond-primary">•</div>
              <span><strong>Machine Learning:</strong> Python libraries like TensorFlow and Scikit-learn for trust score generation</span>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 text-trustbond-primary">•</div>
              <span><strong>Frontend:</strong> React.js and Web3.js for user interfaces and blockchain interaction</span>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-2 text-trustbond-primary">•</div>
              <span><strong>Security:</strong> Multi-factor authentication, encryption, and access control mechanisms</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Process;
