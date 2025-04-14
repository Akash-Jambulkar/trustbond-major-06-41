
import React from 'react';

const TeamSection = () => {
  return (
    <section id="team" className="mb-12">
      <h2 className="text-2xl font-bold text-trustbond-dark mb-4">Our Team</h2>
      <p className="mb-6">
        TrustBond is developed by a team of talented professionals with expertise in blockchain, frontend development, AI/ML, and database management:
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-trustbond-dark">Akash Jambulkar</h3>
          <p className="text-sm text-trustbond-primary mb-2">Frontend & Blockchain</p>
          <p className="text-sm text-gray-600">
            CSEICB, SATI, Vidisha, India
          </p>
          <p className="text-sm text-gray-600">
            akashjambulkar0625@gmail.com
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-trustbond-dark">Jahnvi Chourey</h3>
          <p className="text-sm text-trustbond-primary mb-2">AI/ML</p>
          <p className="text-sm text-gray-600">
            CSEICB, SATI, Vidisha, India
          </p>
          <p className="text-sm text-gray-600">
            choureyjahnvi@gmail.com
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-trustbond-dark">Aadesh Sharma</h3>
          <p className="text-sm text-trustbond-primary mb-2">Frontend</p>
          <p className="text-sm text-gray-600">
            CSEICB, SATI, Vidisha, India
          </p>
          <p className="text-sm text-gray-600">
            adesh05sh@gmail.com
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-trustbond-dark">Shivam Soni</h3>
          <p className="text-sm text-trustbond-primary mb-2">Database</p>
          <p className="text-sm text-gray-600">
            CSEICB, SATI, Vidisha, India
          </p>
          <p className="text-sm text-gray-600">
            shivamsoniji098@gmail.com
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
