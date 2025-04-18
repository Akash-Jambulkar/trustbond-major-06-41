
import SectionHeading from "@/components/SectionHeading";

const Team = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <SectionHeading 
          title="Our Team" 
          subtitle="Meet the dedicated team behind TrustBond"
          centered={true}
        />
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">Aadesh Sharma</h3>
            <p className="text-trustbond-primary text-sm mb-2">Team Lead</p>
            <p className="text-gray-500 text-sm">0108IC211001</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">Akash Jambulkar</h3>
            <p className="text-trustbond-primary text-sm mb-2">Blockchain Developer</p>
            <p className="text-gray-500 text-sm">0108IC211005</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">Jahnvi Chourey</h3>
            <p className="text-trustbond-primary text-sm mb-2">ML Developer</p>
            <p className="text-gray-500 text-sm">0108IC211023</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold">Shivam Soni</h3>
            <p className="text-trustbond-primary text-sm mb-2">Frontend Developer</p>
            <p className="text-gray-500 text-sm">0108IC211053</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Under the guidance of <strong>Prof. Ruchi Thakur</strong>, Assistant Professor, Department of Computer Science & Engineering
          </p>
        </div>
      </div>
    </section>
  );
};

export default Team;
