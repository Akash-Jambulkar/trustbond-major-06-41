
import React from 'react';

const ResultsSection = () => {
  return (
    <section id="results" className="mb-12">
      <h2 className="text-2xl font-bold text-trustbond-dark mb-4">VI. Results and Discussion</h2>
      <p className="mb-4">
        The findings from our feasibility study confirm that integrating blockchain technology with machine learning effectively addresses the limitations of traditional KYC systems and CIBIL score-based credit evaluations. The proposed solution enhances security, accuracy, and efficiency in credit risk assessment while ensuring a seamless verification process for financial institutions.
      </p>
      <div className="my-6 text-center">
        <img src="/placeholder.svg" alt="Artifacts for Trust Score Sharing" className="mx-auto max-w-md" />
        <p className="text-sm text-gray-500 mt-2">Figure 3: Artifacts for Trust Score Sharing</p>
      </div>

      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">A. Addressing the Limitations of Traditional KYC Systems</h3>
      <p className="mb-4">
        Traditional KYC verification processes are fragmented, time-consuming, and susceptible to errors and data breaches. Our proposed blockchain-powered KYC verification system addresses these challenges as follows:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Decentralized and Tamper-Proof Storage:</strong> KYC data is securely stored on a blockchain network, ensuring immutability and protection against fraud or unauthorized modifications.
        </li>
        <li className="mb-2">
          <strong>Cross-Bank Verification:</strong> Instead of redundant KYC checks across multiple banks, a shared blockchain ledger enables real-time access to verified customer data, reducing verification costs and processing times.
        </li>
        <li className="mb-2">
          <strong>Privacy and Security:</strong> Customer data is encrypted and access is controlled through smart contracts, ensuring only authorized institutions can access relevant KYC details.
        </li>
        <li className="mb-2">
          <strong>Real-Time Updates:</strong> Any changes to customer data (e.g., address updates) are instantly reflected across all participating banks, reducing the risk of outdated records.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">B. Enhancing Credit Evaluation with Blockchain-Based Trust Scores</h3>
      <p className="mb-4">
        Traditional credit scoring models, such as CIBIL, suffer from inaccuracy, delayed updates, and lack of transparency. The proposed Trust Score Generation System integrates blockchain with machine learning to provide a more reliable and dynamic risk assessment:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Real-Time Data Integration:</strong> Unlike CIBIL, which relies on periodic updates, our system pulls financial behavior data in real time, ensuring up-to-date trust scores.
        </li>
        <li className="mb-2">
          <strong>Incorporation of Alternative Data Sources:</strong> The trust score considers rental payments, utility bills, savings patterns, and digital transactions, providing a holistic financial assessment.
        </li>
        <li className="mb-2">
          <strong>Transparency and Fair Evaluation:</strong> Machine learning algorithms analyze customer financial patterns objectively, reducing bias in loan approval decisions.
        </li>
        <li className="mb-2">
          <strong>Fraud Prevention:</strong> Since all credit-related transactions are recorded on the blockchain, fraudulent activities such as identity theft and loan stacking are easier to detect and prevent.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">C. Benefits to Financial Institutions and Users</h3>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Financial Institutions:</strong> Reduced risk of loan defaults, improved efficiency in loan processing, and lower operational costs due to streamlined KYC and credit verification.
        </li>
        <li className="mb-2">
          <strong>Customers:</strong> Faster loan approvals, greater financial inclusion for individuals without traditional credit histories, and enhanced data privacy.
        </li>
        <li className="mb-2">
          <strong>Regulatory Compliance:</strong> Blockchain's transparency ensures better adherence to KYC and AML (Anti-Money Laundering) regulations, reducing the risk of non-compliance penalties.
        </li>
      </ul>
    </section>
  );
};

export default ResultsSection;
