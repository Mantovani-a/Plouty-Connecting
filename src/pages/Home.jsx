import React, { useState } from 'react';
import SidebarProfile from '../components/home/SidebarProfile';
import DemandCreator from '../components/home/DemandCreator';
import DemandCard from '../components/home/DemandCard';
import ImpactSidebar from '../components/home/ImpactSidebar';
import { initialDemands } from '../data/demandsData';

export default function Home() {
  const [demands, setDemands] = useState(initialDemands);

  const handleAddDemand = (newDemand) => {
    setDemands([newDemand, ...demands]);
  };

  return (
    <main className="container my-3">
      <div className="row">
        {/* Left: User Profile Summary */}
        <SidebarProfile />

        {/* Center: Demand Creator & Feed */}
        <section className="col-md-6">
          <DemandCreator onAddDemand={handleAddDemand} />

          {demands.map((demand) => (
            <DemandCard key={demand.id} demand={demand} />
          ))}
        </section>

        {/* Right: Impact & ODS */}
        <ImpactSidebar />
      </div>
    </main>
  );
}
