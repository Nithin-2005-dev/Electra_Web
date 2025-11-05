import CoreTeamFilter from "@/components/coreTeamFilter/CoreTeamFilter";
import Header from "@/components/header/Header";
import TeamCard from "@/components/teamCardGroup/TeamCardGroup";
import { TeamStoreProvider } from "@/app/store/TeamStore";
import Footer from "@/components/footer/Footer";

const Team = () => {
  return (
    <main>
      <TeamStoreProvider>
        <Header />
        <CoreTeamFilter />
        <TeamCard />
        <Footer />
      </TeamStoreProvider>
    </main>
  );
};

export default Team;
