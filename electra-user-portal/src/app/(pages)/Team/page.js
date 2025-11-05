import { TeamStoreProvider } from "../../store/TeamStore"
import CoreTeam from "../../../components/Team"

export default function Team(){
    return (
        <main className="min-h-screen">
        <TeamStoreProvider>
               <CoreTeam/>
        </TeamStoreProvider>
              </main>
    )
}