import MerchHeroVideo from "../../../components/merch/MerchHeroVideo";
import MerchGrid from "../../../components/merch/MerchGrid";

export const metadata = {
  title: "Get Your Merch | Electra",
  description:
    "Shop official Electra merchandise, including apparel and accessories.",
};

export default function MerchPage() {
  return (
    <main style={{ background: "#000" }}>
      <MerchHeroVideo />
      <MerchGrid />
    </main>
  );
}
