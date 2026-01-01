import { TeamStoreProvider } from "../../store/TeamStore";
import TeamPage from "../../../components/team/TeamPage";

export default function Team() {
  return (
    <main className="min-h-screen bg-black">
      <TeamStoreProvider>
        <TeamPage />
      </TeamStoreProvider>
    </main>
  );
}
