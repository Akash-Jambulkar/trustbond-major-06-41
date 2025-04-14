
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;
