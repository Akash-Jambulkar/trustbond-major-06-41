
import React from 'react';

const IntroductionSection = () => {
  return (
    <section id="introduction" className="mb-12">
      <h2 className="text-2xl font-bold text-trustbond-dark mb-4">I. Introduction</h2>
      <p className="mb-4">
        KYC (Know Your client) is a crucial component in combating financial crime and money laundering, with client identification being the most vital factor, as it serves as the initial step for enhancing performance in subsequent stages of the process. The electronic know your customer (e-KYC) is a technique utilized by banks or identity providers to verify consumer identity data across dependent parties. Financial institutions can use off the-shelf e-KYC software that has all the features they need, or they can create their own software from the ground up to deploy the system. They can then choose between an on-premise or cloud-based deployment approach for the system.
      </p>
      <p className="mb-4">
        The majority of businesses now store their systems and data on the cloud, thanks to the popularity of outsourcing. Compared to the host-based e-KYC authentication approach, which requires document validation via the centralized host, a cloud-based e-KYC system offers a more efficient and flexible authentication method. Generating a normalized index called as trust scores with machine learning algorithms and blockchain technology and further verifying the electronically generated KYC has proved successful in several findings.
      </p>
      <p className="mb-4">
        Automation of the process of KYC is one of the crucial aspects in the e-KYC. The automation with smart contracts improves efficiency by reducing operational expenses and minimizing human interventions in the process. This also prevents redundant verification through various sources of financial transaction or institutions. Consequently, the integration through varied services reduces the time and incurs minimal expenditures.
      </p>
      <p className="mb-4">
        Trust scores, as a final metric for assessment, are transparent and immune to manipulation or tempering of records, due to the inherent characteristics of blockchain, immutability. This ensures trust in the process with enhanced credibility and supports streamlined decision-making. This is accomplished by providing real-time access to trust profiles.
      </p>
      <p className="mb-4">
        The goal of the blockchain-based KYC Verification and Trust Score Generation project is to provide a safe and effective system that enables banks to calculate trust scores for loan applications, store customer KYC data on the blockchain, and validate customer data. This project for KYC automation aims at improving the security and accuracy of procedures client verification while optimizing cross-bank interactions by using the immutability and security of blockchain technology in conjunction with machine learning for real-time risk assessment.
      </p>

      <div className="my-6">
        <p className="font-semibold mb-2">For the scope of work proposed in this paper, we identified certain implementation goals, namely:</p>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-1">Securely storing KYC data on the blockchain to guarantee transparency and immutability.</li>
          <li className="mb-1">Using smart contracts and APIs to make data sharing between banks easier.</li>
          <li className="mb-1">Using machine learning algorithms to create Trust Scores based on client information.</li>
          <li className="mb-1">Giving banks access to real-time monitoring and risk assessment tools.</li>
        </ol>
      </div>
      
      <p>
        The plan for implementation includes backend support using Node.js/Express and Python/Flask to handle KYC data. It also incorporates integrating Web3.js/Ethers.js for blockchain interaction to store KYC data, verify integrity requests and storage. Further, trust scores are generated using machine learning models using Python libraries (e.g. TensorFlow, Scikit-learn).
      </p>
    </section>
  );
};

export default IntroductionSection;
