
import { CheckCircle } from "lucide-react";

const VisionMission = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-gray-700 mb-6">
              We envision a financial ecosystem where identity verification is done once, securely stored on the blockchain, and reusable across services. Where trust scores provide an objective measure of creditworthiness that follows individuals throughout their financial journey. Where loans are transparent, fair, and accessible to all.
            </p>
            <p className="text-gray-700">
              TrustBond is building the infrastructure for this future, one block at a time.
            </p>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              Our mission is to revolutionize how identity verification and loan processes work in the digital age by making these essential financial services:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-trustbond-primary mr-2" />
                <span><strong>Secure:</strong> Protecting user data and privacy above all else</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-trustbond-primary mr-2" />
                <span><strong>Efficient:</strong> Eliminating redundant processes and waiting periods</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-trustbond-primary mr-2" />
                <span><strong>Transparent:</strong> Providing clear visibility into all processes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-trustbond-primary mr-2" />
                <span><strong>Inclusive:</strong> Making financial services accessible to more people</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-trustbond-primary mr-2" />
                <span><strong>User-Controlled:</strong> Giving individuals control over their data</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
