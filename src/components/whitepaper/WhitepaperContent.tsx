
import React from 'react';
import AbstractSection from './content/AbstractSection';
import IntroductionSection from './content/IntroductionSection';
import KycSmartContractsSection from './content/KycSmartContractsSection';
import LiteratureReviewSection from './content/LiteratureReviewSection';
import ProposedModelSection from './content/ProposedModelSection';
import ImplementationSection from './content/ImplementationSection';
import ResultsSection from './content/ResultsSection';
import ConclusionSection from './content/ConclusionSection';
import TeamSection from './TeamSection';

const WhitepaperContent = () => {
  return (
    <div className="prose max-w-none">
      <AbstractSection />
      <IntroductionSection />
      <KycSmartContractsSection />
      <LiteratureReviewSection />
      <ProposedModelSection />
      <ImplementationSection />
      <ResultsSection />
      <ConclusionSection />
      <TeamSection />
      
      {/* References section would go here if needed */}
    </div>
  );
};

export default WhitepaperContent;
