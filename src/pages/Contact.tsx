
import Footer from "@/components/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactFAQ from "@/components/contact/ContactFAQ";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ContactHeader />
      <ContactHero />
      
      {/* Contact Info and Form */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <ContactFAQ />
      <Footer />
    </div>
  );
};

export default Contact;
