
import { Shield, BarChart, Database } from "lucide-react";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-trustbond-dark mb-4">How TrustBond Works</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our platform connects individuals, banks, and blockchain technology to create a seamless verification and lending ecosystem.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-trustbond-primary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <Shield size={24} className="text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Secure KYC Verification</h3>
            <p className="text-gray-700 mb-4">
              Users upload identity documents which are verified by trusted financial institutions. The verification status is recorded on the blockchain, while sensitive data remains protected.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-primary shrink-0 mt-1" />
                <span>Document hashing for security</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-primary shrink-0 mt-1" />
                <span>Bank verification process</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-primary shrink-0 mt-1" />
                <span>Blockchain-recorded status</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-trustbond-secondary/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <BarChart size={24} className="text-trustbond-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Trust Score System</h3>
            <p className="text-gray-700 mb-4">
              Based on verified credentials and financial history, our algorithm calculates a trust score that serves as a portable measure of creditworthiness.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-secondary shrink-0 mt-1" />
                <span>Transparent scoring algorithm</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-secondary shrink-0 mt-1" />
                <span>Score improvement pathways</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-secondary shrink-0 mt-1" />
                <span>Real-time score updates</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-trustbond-accent/10 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
              <Database size={24} className="text-trustbond-accent" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-3">Smart Contract Loans</h3>
            <p className="text-gray-700 mb-4">
              Using their trust scores, users can apply for loans with transparent terms encoded in smart contracts, ensuring fair and automatic execution.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-accent shrink-0 mt-1" />
                <span>Transparent loan terms</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-accent shrink-0 mt-1" />
                <span>Automated disbursements</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="text-trustbond-accent shrink-0 mt-1" />
                <span>Scheduled repayments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
