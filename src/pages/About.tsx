
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  Database, 
  Users, 
  Lock, 
  BarChart2, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  ChevronRight
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block text-sm font-semibold bg-white/20 px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            About TrustBond
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Transforming KYC Verification Through Blockchain Innovation
          </h1>
          <p className="text-xl leading-relaxed mb-12 text-white/90 animate-fade-in max-w-3xl mx-auto">
            Our mission is to create a more secure, efficient, and inclusive financial ecosystem through decentralized identity verification and trust scoring.
          </p>
          <div className="flex justify-center gap-6 flex-wrap animate-fade-in">
            <Link to="/whitepaper">
              <Button 
                className="bg-white text-trustbond-primary hover:bg-gray-100 font-medium text-base px-6 py-3 h-auto"
              >
                Read Our Whitepaper
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 font-medium text-base px-6 py-3 h-auto"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-trustbond-primary bg-trustbond-primary/10 px-4 py-1 rounded-full mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold text-trustbond-dark mb-6">
                Building a Transparent Financial Ecosystem
              </h2>
              <p className="text-trustbond-muted mb-6 leading-relaxed">
                TrustBond was founded with a clear mission: to revolutionize how identity verification and loan processes work in the digital age. We believe that these essential financial services should be secure, efficient, transparent, inclusive, and user-controlled.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <CheckCircle size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-trustbond-muted"><strong className="text-trustbond-dark">Secure:</strong> Protecting user data and privacy using advanced encryption and blockchain technology.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <CheckCircle size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-trustbond-muted"><strong className="text-trustbond-dark">Efficient:</strong> Eliminating redundant verification processes and unnecessary waiting periods.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <CheckCircle size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-trustbond-muted"><strong className="text-trustbond-dark">Transparent:</strong> Providing clear visibility into all processes and decisions through blockchain records.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-trustbond-primary/10 p-1 rounded-full mt-1">
                    <CheckCircle size={16} className="text-trustbond-primary" />
                  </div>
                  <p className="text-trustbond-muted"><strong className="text-trustbond-dark">Inclusive:</strong> Making financial services accessible to more people regardless of their background.</p>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-trustbond-primary to-trustbond-secondary rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="mb-6 leading-relaxed">
                We envision a future where identity verification is done once, securely stored on the blockchain, and reusable across financial services. Where trust scores provide an objective measure of creditworthiness that follows individuals throughout their financial journey. Where loans are transparent, fair, and accessible to all.
              </p>
              <p className="font-medium">
                TrustBond is building the infrastructure for this future, one block at a time.
              </p>
              <div className="mt-8">
                <Link to="/register" className="inline-flex items-center text-white font-medium hover:underline">
                  Join Our Platform <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-trustbond-secondary bg-trustbond-secondary/10 px-4 py-1 rounded-full mb-4">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-trustbond-dark mb-4">
              How TrustBond Works
            </h2>
            <p className="text-trustbond-muted text-lg max-w-3xl mx-auto">
              Our platform connects individuals, banks, and blockchain technology to create a seamless verification and lending ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-trustbond-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-6">
                <Shield size={24} className="text-trustbond-primary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-4">Secure KYC Verification</h3>
              <p className="text-trustbond-muted mb-6">
                Users upload identity documents which are verified by trusted financial institutions. The verification status is recorded on the blockchain, while sensitive data remains protected.
              </p>
              <ul className="text-trustbond-muted space-y-3">
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
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-trustbond-secondary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-6">
                <BarChart2 size={24} className="text-trustbond-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-4">Trust Score System</h3>
              <p className="text-trustbond-muted mb-6">
                Based on verified credentials and financial history, our algorithm calculates a trust score that serves as a portable measure of creditworthiness.
              </p>
              <ul className="text-trustbond-muted space-y-3">
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
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-trustbond-accent/10 w-16 h-16 flex items-center justify-center rounded-lg mb-6">
                <Database size={24} className="text-trustbond-accent" />
              </div>
              <h3 className="text-xl font-semibold text-trustbond-dark mb-4">Smart Contract Loans</h3>
              <p className="text-trustbond-muted mb-6">
                Using their trust scores, users can apply for loans with transparent terms encoded in smart contracts, ensuring fair and automatic execution.
              </p>
              <ul className="text-trustbond-muted space-y-3">
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
          
          <div className="mt-16 p-8 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-trustbond-dark">Technical Implementation</h3>
            <p className="text-trustbond-muted mb-6">
              TrustBond is built on a robust technology stack that includes:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-trustbond-muted">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-trustbond-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-trustbond-primary font-semibold text-sm">1</span>
                  </div>
                  <span><strong className="text-trustbond-dark">Backend:</strong> Node.js/Express and Python/Flask for handling KYC data requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-trustbond-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-trustbond-primary font-semibold text-sm">2</span>
                  </div>
                  <span><strong className="text-trustbond-dark">Blockchain:</strong> Web3.js/Ethers.js for blockchain interactions and smart contracts</span>
                </li>
              </ul>
              <ul className="space-y-3 text-trustbond-muted">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-trustbond-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-trustbond-primary font-semibold text-sm">3</span>
                  </div>
                  <span><strong className="text-trustbond-dark">ML:</strong> Python libraries for trust score generation and risk assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-trustbond-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-trustbond-primary font-semibold text-sm">4</span>
                  </div>
                  <span><strong className="text-trustbond-dark">Frontend:</strong> React.js and Web3.js for user interfaces and blockchain interaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-trustbond-primary bg-trustbond-primary/10 px-4 py-1 rounded-full mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-trustbond-dark mb-4">
              Meet the Team Behind TrustBond
            </h2>
            <p className="text-trustbond-muted text-lg max-w-3xl mx-auto">
              A group of dedicated experts with a passion for blockchain technology and financial inclusion.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-trustbond-dark">Aadesh Sharma</h3>
              <p className="text-trustbond-primary text-sm mb-2">Team Lead</p>
              <p className="text-trustbond-muted text-sm">0108IC211001</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-trustbond-dark">Akash Jambulkar</h3>
              <p className="text-trustbond-primary text-sm mb-2">Blockchain Developer</p>
              <p className="text-trustbond-muted text-sm">0108IC211005</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-trustbond-dark">Jahnvi Chourey</h3>
              <p className="text-trustbond-primary text-sm mb-2">ML Developer</p>
              <p className="text-trustbond-muted text-sm">0108IC211023</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center card-hover">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-trustbond-dark">Shivam Soni</h3>
              <p className="text-trustbond-primary text-sm mb-2">Frontend Developer</p>
              <p className="text-trustbond-muted text-sm">0108IC211053</p>
            </div>
          </div>
          
          <div className="mt-12 text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-trustbond-muted">
              Under the guidance of <strong className="text-trustbond-dark">Prof. Ruchi Thakur</strong>, Assistant Professor, Department of Computer Science & Engineering
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Join TrustBond?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 text-white/90">
            Whether you're an individual seeking secure KYC and loans, a bank looking to streamline verification, or a developer interested in our technology, we welcome you to our platform.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link to="/register">
              <Button 
                className="bg-white text-trustbond-primary hover:bg-gray-100 font-medium text-base px-8 py-3 h-auto"
              >
                Create an Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/whitepaper">
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/20 font-medium text-base px-8 py-3 h-auto"
              >
                Read Whitepaper
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
