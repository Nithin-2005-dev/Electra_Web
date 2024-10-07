import CoreTeamFilter from "@/components/coreTeamFilter/CoreTeamFilter"
import Header from "@/components/header/Header"
import TeamCard from "@/components/teamCardGroup/TeamCardGroup"
import Loader from "./loading"

const Team = () => {
  return (
    <>
    <CoreTeamFilter/>
    <TeamCard/>
    </>
  )
}

export default Team
