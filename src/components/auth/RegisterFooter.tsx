
import React from "react";
import { Link } from "react-router-dom";

export const RegisterFooter = () => {
  return (
    <>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-trustbond-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        By creating an account, you agree to TrustBond's{" "}
        <a href="#" className="text-trustbond-primary hover:underline">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="text-trustbond-primary hover:underline">Privacy Policy</a>.
      </div>
    </>
  );
};
