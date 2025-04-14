
import React from 'react';

const KycSmartContractsSection = () => {
  return (
    <section id="kyc-smart-contracts" className="mb-12">
      <h2 className="text-2xl font-bold text-trustbond-dark mb-4">II. KYC and Smart Contracts</h2>
      <p className="mb-4">
        Know-your-customer (KYC) implies to the measures or procedures adopted by financial agencies or companies, especially banks, to confirm the legitimacy of its clients. The purpose of this regulatory mandate is to forestall unlawful behaviors like money laundering and fraud. Key components of KYC include:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Customer Identification:</strong> Collecting and verifying personal information, such as name, address, and ID documents.
        </li>
        <li className="mb-2">
          <strong>Customer Due Diligence:</strong> Assessing the risk level of the customer based on their activities, source of funds, and financial behavior.
        </li>
        <li className="mb-2">
          <strong>Ongoing Monitoring:</strong> Continuously monitoring transactions and updating customer information to ensure compliance with regulations.
        </li>
        <li className="mb-2">
          <strong>Verified Identity:</strong> Confirmation of the customer's personal details, such as name, address, and identification documents.
        </li>
        <li className="mb-2">
          <strong>Risk Assessment:</strong> Categorization of the customer based on their risk profile, enabling businesses to apply appropriate monitoring measures.
        </li>
        <li className="mb-2">
          <strong>Regulatory Compliance:</strong> Assurance that the business adheres to legal and regulatory requirements, such as anti-money laundering (AML) laws.
        </li>
        <li className="mb-2">
          <strong>Customer Trust:</strong> Establishment of a secure and transparent relationship between the business and the customer.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">A. Challenges in Know Your Customer (KYC) verification</h3>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>High Operational Costs:</strong> KYC processes require substantial resources, including staff, technology, and infrastructure, leading to increased costs for financial institutions.
        </li>
        <li className="mb-2">
          <strong>Inefficiency and Redundancy:</strong> Customers often need to repeat KYC verification with multiple organizations, causing delays and frustration. Institutions face redundancy in verifying the same information repeatedly.
        </li>
        <li className="mb-2">
          <strong>Data Security and Privacy Risks:</strong> Centralized storage of sensitive customer data increases the risk of breaches, hacking, and identity theft. Ensuring compliance with global privacy regulations, such as GDPR, adds complexity.
        </li>
        <li className="mb-2">
          <strong>Limited Interoperability:</strong> Lack of standardization across institutions and jurisdictions makes it difficult to share verified KYC data securely. Fragmented systems hinder global collaboration and efficiency.
        </li>
        <li className="mb-2">
          <strong>Evolving Fraud Tactics:</strong> Fraudsters continuously develop new methods to bypass KYC checks, making it challenging for institutions to stay ahead. Synthetic identities and document forgery are persistent issues.
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-trustbond-dark mb-2">B. Smart Contracts</h3>
      <p className="mb-4">
        Smart contracts are self-executing programs stored on a blockchain that automatically enforce, verify, or execute terms of an agreement without the need for intermediaries. They operate based on predefined rules coded into them, and once conditions are met, the contract triggers the agreed-upon actions. Key features of smart contracts include:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li className="mb-2">
          <strong>Automation:</strong> Smart contracts eliminate the need for manual intervention by executing tasks automatically.
        </li>
        <li className="mb-2">
          <strong>Immutability:</strong> Once deployed on the blockchain, smart contracts cannot be altered, ensuring trust and transparency.
        </li>
        <li className="mb-2">
          <strong>Decentralization:</strong> Smart contracts operate on decentralized blockchain networks, removing reliance on centralized authorities.
        </li>
        <li className="mb-2">
          <strong>Security:</strong> Blockchain encryption ensures the integrity and safety of the contract's code and execution.
        </li>
      </ul>
      <p>
        For example, in KYC verification, a smart contract could automatically grant access to a customer's verified data to a financial institution upon approval, streamlining the process and reducing fraud. A customer completes KYC verification at one bank. The verified data is stored in an encrypted format on IPFS, and a smart contract logs the verification status. When another bank needs the same KYC data, the customer grants access through the smart contract, eliminating the need to repeat the process.
      </p>
    </section>
  );
};

export default KycSmartContractsSection;
