
import React from 'react';

const ProposedModelSection = () => {
  return (
    <section id="proposed-model" className="mb-12">
      <h2 className="text-2xl font-bold text-trustbond-dark mb-4">IV. Proposed Model</h2>
      <p className="mb-4">
        We hereby propose a model to establish the foundation for the blockchain-powered KYC Verification and Trust Score Creation initiative project. The goal of the blockchain-based KYC Verification and Trust Score Generation project is to provide a safe and effective system that enables banks to calculate trust scores for loan applications, store customer KYC (Know Your Customer) data on the blockchain, and validate customer data. This project aims to augment the security and precision of client verification procedures while optimizing cross-bank interactions by using the immutability and security of blockchain technology in conjunction with machine learning for real-time risk assessment.
      </p>
      <div className="my-6 text-center">
        <img src="/placeholder.svg" alt="Secure Sharing of Client Data" className="mx-auto max-w-md" />
        <p className="text-sm text-gray-500 mt-2">Figure 2: Secure Sharing of Client Data</p>
      </div>
      <p className="mb-4">
        To initiate the study, we conducted a feasibility study to assess the technological and market viability. The findings are as follows:
      </p>
      <p className="mb-4">
        <strong>Technology Overview:</strong> Blockchain technology provides a safe, decentralized method of storing KYC information that is verifiable by several banks. Trust Scores can be produced by integrating machine learning models to evaluate consumer data. These technologies work together to guarantee accuracy and security and market viability as:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Market Share:</strong> Blockchain use in the financial sector is fast increasing, with a large number of banks investigating its possibilities for secure data storage and verification.
        </li>
        <li className="mb-2">
          <strong>User Base:</strong> As financial institutions want more secure and efficient KYC processes, demand for blockchain-based solutions is projected to increase.
        </li>
        <li className="mb-2">
          <strong>Risk Mitigation:</strong> Blockchain's immutability decreases the risk of data tampering, and machine learning delivers reliable risk evaluations, making this platform an appealing choice for banks.
        </li>
      </ul>
    </section>
  );
};

export default ProposedModelSection;
