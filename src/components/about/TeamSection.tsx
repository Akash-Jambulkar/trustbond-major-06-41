
import { Users } from "lucide-react";

const TeamSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-trustbond-dark mb-4">Project Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            TrustBond is developed by a team of dedicated students from the Department of Computer Science & Engineering.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users size={36} className="text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-1">Project Team</h3>
            <p className="text-trustbond-primary mb-4">Student Developers</p>
            <p className="text-gray-700 mb-4">
              A collaborative effort of four dedicated students working on blockchain technology, machine learning, and web development to create a secure and efficient KYC verification system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-trustbond-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users size={36} className="text-trustbond-primary" />
            </div>
            <h3 className="text-xl font-semibold text-trustbond-dark mb-1">Project Guide</h3>
            <p className="text-trustbond-primary mb-4">Faculty Mentor</p>
            <p className="text-gray-700 mb-4">
              Under the expert guidance of Prof. Ruchi Thakur, who provides valuable insights and direction in developing this innovative blockchain-based solution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
