
import { Button } from "@/components/ui/button";

const ContactFAQ = () => {
  return (
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
  );
};

export default ContactFAQ;
