import { ScanFace } from "lucide-react";
import { GridSection, SectionHeader } from "@/components/roadmap/sections";
import { ProfileWall } from "@/components/progress/ProfileWall";

/**
 * dub.co/analytics' "Know your customer" band — header with one action over
 * the wall of cards around a portrait, fading out at the sides and the foot.
 */
export function ProfileSection() {
  return (
    <GridSection id="profile" labelledBy="profile-heading" innerClassName="pt-20">
      <SectionHeader
        id="profile-heading"
        icon={ScanFace}
        eyebrow="Twój profil"
        title="Twój profil postępów"
        sub="Cel, seria, wyniki arkuszy i każdy opanowany temat — cała historia nauki od pierwszego zadania."
        actions={[{ label: "Załóż konto", href: "/signup", variant: "primary" }]}
      />
      <ProfileWall />
    </GridSection>
  );
}
