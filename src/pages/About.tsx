
import React from "react";
import { 
  Shield, 
  Lock, 
  BarChart2, 
  FileText, 
  Database, 
  RefreshCw,
  CheckCircle,
  UserCheck,
  LineChart,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FeatureCard from "@/components/FeatureCard";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="default" className="mb-4 bg-white/20 backdrop-blur-sm">About TrustBond</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Revolutionizing KYC Verification with Blockchain
              </h1>
              <p className="text-xl mb-8 opacity-90">
                A secure, efficient, and transparent system that transforms how financial institutions verify identities and assess risk.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" asChild>
                  <Link to="/whitepaper">Read Whitepaper</Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact">Contact Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision and Mission */}
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
        
        {/* Key Features */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading 
              title="Key Features" 
              subtitle="TrustBond combines blockchain technology with machine learning to create a revolutionary KYC verification and trust score platform."
              centered={true}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Shield}
                title="Secure KYC Verification"
                description="Documents are securely hashed and stored on the blockchain, ensuring data integrity while protecting sensitive information."
              />
              <FeatureCard 
                icon={BarChart2}
                title="Trust Score Generation"
                description="Machine learning algorithms analyze customer data to create reliable trust scores for more accurate risk assessment."
              />
              <FeatureCard 
                icon={Database}
                title="Smart Contract Integration"
                description="Automated verification processes and transparent loan terms through immutable smart contracts."
              />
              <FeatureCard 
                icon={UserCheck}
                title="Cross-Bank Collaboration"
                description="Secure sharing of verified KYC data across financial institutions, reducing redundancy and improving efficiency."
              />
              <FeatureCard 
                icon={Lock}
                title="Enhanced Data Security"
                description="Multi-factor authentication and encryption ensure that sensitive data is protected from unauthorized access."
              />
              <FeatureCard 
                icon={LineChart}
                title="Real-Time Risk Assessment"
                description="Dynamic monitoring and assessment of financial risk for better decision-making in loan applications."
              />
            </div>
          </div>
        </section>
        
        {/* How It Works */}
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
        
        {/* Team Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <SectionHeading 
              title="Our Team" 
              subtitle="Meet the dedicated team behind TrustBond"
              centered={true}
            />
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Aadesh Sharma</h3>
                <p className="text-trustbond-primary text-sm mb-2">Team Lead</p>
                <p className="text-gray-500 text-sm">0108IC211001</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Akash Jambulkar</h3>
                <p className="text-trustbond-primary text-sm mb-2">Blockchain Developer</p>
                <p className="text-gray-500 text-sm">0108IC211005</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Jahnvi Chourey</h3>
                <p className="text-trustbond-primary text-sm mb-2">ML Developer</p>
                <p className="text-gray-500 text-sm">0108IC211023</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold">Shivam Soni</h3>
                <p className="text-trustbond-primary text-sm mb-2">Frontend Developer</p>
                <p className="text-gray-500 text-sm">0108IC211053</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-gray-600">
                Under the guidance of <strong>Prof. Ruchi Thakur</strong>, Assistant Professor, Department of Computer Science & Engineering
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform KYC Verification?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
              Whether you're a financial institution looking to streamline your KYC process or a developer interested in our technology, we'd love to hear from you.
            </p>
            <Button variant="default" className="bg-white text-trustbond-primary hover:bg-gray-100" size="lg" asChild>
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
