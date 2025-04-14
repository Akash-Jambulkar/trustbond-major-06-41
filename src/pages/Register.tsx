
import { RegisterHeader } from "@/components/auth/RegisterHeader";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterFooter } from "@/components/auth/RegisterFooter";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with navigation and mode warning */}
      <RegisterHeader />

      {/* Main content with registration form */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-trustbond-dark">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Join TrustBond to access secure KYC and loan services
            </p>
          </div>
          
          <RegisterForm />
          
          <RegisterFooter />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
        © 2025 TrustBond. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;
