import { TeamStoreProvider } from "../../store/TeamStore";
import TeamPage from "../../../components/team/TeamPage";

export const metadata = {
  title: "Team | Electra",
  description: "Meet the people building Electra and the community behind it.",
};

export default function Team() {
  return (
    <main className="min-h-screen bg-black">
      <TeamStoreProvider>
        <TeamPage />
      </TeamStoreProvider>
    </main>
  );
}
