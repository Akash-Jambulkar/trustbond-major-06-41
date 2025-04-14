
import React from 'react';
import { BookOpen, ExternalLink } from "lucide-react";

const AdditionalResources = () => {
  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-trustbond-dark mb-4">Additional Resources</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <a href="#" className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow">
          <BookOpen size={20} className="text-trustbond-primary mr-3" />
          <div>
            <h4 className="font-medium text-trustbond-dark">Technical Documentation</h4>
            <p className="text-sm text-gray-600">Detailed technical specifications</p>
          </div>
        </a>
        <a href="#" className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow">
          <ExternalLink size={20} className="text-trustbond-primary mr-3" />
          <div>
            <h4 className="font-medium text-trustbond-dark">GitHub Repository</h4>
            <p className="text-sm text-gray-600">Open-source code and contributions</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdditionalResources;
