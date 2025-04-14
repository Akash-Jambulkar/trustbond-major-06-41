
import React from 'react';

const ImplementationSection = () => {
  return (
    <section id="implementation" className="mb-12">
      <h2 className="text-2xl font-bold text-trustbond-dark mb-4">V. Implementation of the Model</h2>
      <p className="mb-4">
        The proposed model was compared with several approaches to realize the process of generating requests and sharing the information via secure channel. Conclusively, a method for enhanced security-based trust score generation, stored as Blockchain data is implemented. The attributes for calculating the score is a customizable weightage-based approach. 
      </p>
      <p className="mb-4">
        Implementation steps include:
      </p>
      <ol className="list-decimal pl-6 mb-4">
        <li className="mb-2">Implementing backend using Node.js/Express and Python/Flask to handle KYC data requests and storage.</li>
        <li className="mb-2">Integrating Web3.js/Ethers.js for blockchain interaction to store KYC data and verify integrity.</li>
        <li className="mb-2">Designing and developing machine learning models using Python libraries (e.g. TensorFlow, Scikit-learn) for generating Trust Scores.</li>
        <li className="mb-2">Deploying backend on local server providing scalability and security.</li>
        <li className="mb-2">Developing frontend interfaces using React.js and Web3.js for user interaction and data submission.</li>
        <li className="mb-2">Implementing API gateways for secure communication between banks and the blockchain network.</li>
        <li className="mb-2">Finalize the integration of machine learning models into the backend for real-time Trust Score generation.</li>
        <li className="mb-2">Perform thorough testing and debugging of all features to ensure smooth operation.</li>
        <li className="mb-2">Deploy the platform to a secure hosting environment.</li>
        <li className="mb-2">Set up monitoring tools (e.g., Prometheus, Grafana) for real-time system health checks and risk assessment.</li>
      </ol>
      <div className="my-6 text-center">
        <img src="/placeholder.svg" alt="AI-Generated Implementation Ecosystem" className="mx-auto max-w-md" />
        <p className="text-sm text-gray-500 mt-2">Figure 4: AI-Generated Implementation Ecosystem</p>
      </div>
    </section>
  );
};

export default ImplementationSection;
