
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, topic: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-trustbond-primary to-trustbond-secondary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <span className="inline-block text-sm font-semibold bg-white/20 px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl max-w-2xl mx-auto mb-6 text-white/90">
            Have questions about TrustBond? We're here to help you with any inquiries about our platform, services, or technology.
          </p>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-trustbond-dark">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-trustbond-primary/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-trustbond-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-trustbond-dark">Email</h3>
                      <p className="text-trustbond-muted mt-1">info@trustbond.com</p>
                      <p className="text-trustbond-muted">support@trustbond.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-trustbond-primary/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-trustbond-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-trustbond-dark">Phone</h3>
                      <p className="text-trustbond-muted mt-1">+1 (555) 123-4567</p>
                      <p className="text-trustbond-muted">Mon-Fri, 9AM-5PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-trustbond-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-trustbond-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-trustbond-dark">Address</h3>
                      <p className="text-trustbond-muted mt-1">
                        123 Tech Park, Indore
                      </p>
                      <p className="text-trustbond-muted">
                        Madhya Pradesh, 452001, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-trustbond-primary/10 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-trustbond-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-trustbond-dark">Social</h3>
                      <div className="flex gap-4 mt-2">
                        <a href="#" className="text-trustbond-muted hover:text-trustbond-primary">Twitter</a>
                        <a href="#" className="text-trustbond-muted hover:text-trustbond-primary">LinkedIn</a>
                        <a href="#" className="text-trustbond-muted hover:text-trustbond-primary">GitHub</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-trustbond-dark">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-trustbond-dark mb-2">Thank You!</h3>
                    <p className="text-trustbond-muted max-w-md mx-auto">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                    <Button 
                      className="mt-6 bg-trustbond-primary hover:bg-trustbond-primary/90" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                          className="focus-visible:ring-trustbond-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                          className="focus-visible:ring-trustbond-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Select 
                        value={formData.topic} 
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger id="topic" className="focus:ring-trustbond-primary">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                          <SelectItem value="kyc">KYC Verification</SelectItem>
                          <SelectItem value="blockchain">Blockchain Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your inquiry in detail..."
                        required
                        className="min-h-32 focus-visible:ring-trustbond-primary"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-trustbond-primary hover:bg-trustbond-primary/90 w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">●</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
              
              {/* FAQ Section */}
              <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-trustbond-dark">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-trustbond-dark mb-2">What is TrustBond?</h3>
                    <p className="text-trustbond-muted">
                      TrustBond is a blockchain-based platform that provides secure KYC verification, trust scoring, and loan processing for users and financial institutions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-trustbond-dark mb-2">How does the KYC verification work?</h3>
                    <p className="text-trustbond-muted">
                      Users submit their KYC documents through our secure platform. The documents are verified by authorized banks, and the verification status is recorded on the blockchain.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-trustbond-dark mb-2">Is my data secure on TrustBond?</h3>
                    <p className="text-trustbond-muted">
                      Yes, we employ advanced encryption and blockchain technology to ensure that your sensitive data is protected. Only the verification status is stored on the blockchain, not your actual documents.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-trustbond-dark mb-2">How can banks join the TrustBond platform?</h3>
                    <p className="text-trustbond-muted">
                      Banks can apply for membership through our Bank Registration process. After approval, banks can participate in KYC verification and offer loans to verified users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
            <p className="text-trustbond-muted">Interactive Map Here</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
