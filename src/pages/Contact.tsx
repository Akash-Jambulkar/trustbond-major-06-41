
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trustbond-primary">
            TrustBond
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link to="/" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              About
            </Link>
            <Link to="/whitepaper" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Whitepaper
            </Link>
            <Link to="/login" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-trustbond-dark hover:text-trustbond-primary transition-colors">
              Register
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Menu</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-trustbond-primary text-white py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Have questions about TrustBond? We'd love to hear from you. Reach out to our team using the contact information below or fill out the form.
          </p>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-trustbond-dark mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-trustbond-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-trustbond-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-trustbond-dark">Email</h3>
                    <p className="text-gray-700">info@trustbond.com</p>
                    <p className="text-gray-700">support@trustbond.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-trustbond-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-trustbond-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-trustbond-dark">Phone</h3>
                    <p className="text-gray-700">+1 (123) 456-7890</p>
                    <p className="text-gray-700">+1 (987) 654-3210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-trustbond-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-trustbond-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-trustbond-dark">Office Location</h3>
                    <p className="text-gray-700">
                      123 Blockchain Street<br />
                      Suite 456<br />
                      Digital City, DC 10101
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-trustbond-dark mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM (EST)</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM (EST)</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-trustbond-dark mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-trustbond-primary hover:bg-trustbond-primary/90 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-trustbond-dark mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Find quick answers to common questions about TrustBond.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                  How does TrustBond protect my personal information?
                </h3>
                <p className="text-gray-700">
                  TrustBond uses blockchain technology to store only verification statuses and document hashes. Your actual personal information remains with you, and only the validation status is shared when necessary.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                  Who verifies my KYC documents?
                </h3>
                <p className="text-gray-700">
                  TrustBond partners with established financial institutions who verify your KYC documents according to regulatory standards. Once verified, the status is recorded on the blockchain.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                  How is my trust score calculated?
                </h3>
                <p className="text-gray-700">
                  Your trust score is calculated based on a transparent algorithm that considers verified credentials, financial history, and loan repayment behavior. The exact formula is published in our whitepaper.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-trustbond-dark mb-2">
                  Do I need cryptocurrency to use TrustBond?
                </h3>
                <p className="text-gray-700">
                  No, TrustBond is designed to be accessible to everyone. While we use blockchain technology, users can interact with the platform using traditional currencies. You'll need a digital wallet for authentication purposes.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-4">
                Don't see your question here? Feel free to reach out to us directly.
              </p>
              <Button asChild className="bg-trustbond-primary hover:bg-trustbond-primary/90">
                <a href="#top">Contact Us Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trustbond-dark text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TrustBond</h3>
              <p className="text-gray-300">
                A blockchain-powered platform for secure KYC verification and decentralized loans.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/whitepaper" className="text-gray-300 hover:text-white transition-colors">Whitepaper</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/whitepaper" className="text-gray-300 hover:text-white transition-colors">Whitepaper</Link>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Email: info@trustbond.com</li>
                <li className="text-gray-300">Phone: +1 (123) 456-7890</li>
                <li className="text-gray-300">Address: 123 Blockchain Street, Digital City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 TrustBond. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
