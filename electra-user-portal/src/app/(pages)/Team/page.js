import CoreTeamFilter from "@/components/coreTeamFilter/CoreTeamFilter"
import Header from "@/components/header/Header"
import TeamCard from "@/components/teamCardGroup/TeamCardGroup"
import Loader from "./loading"
import { TeamStoreProvider } from "@/app/store/TeamStore"

const Team = () => {
  return (
    <TeamStoreProvider>
      <Header/>
    <CoreTeamFilter/>
    <TeamCard/>
    </TeamStoreProvider>
  )
}

export default Team
