import { Container } from "@/components/ui/Container";

/* ---------------------------------------------------------------------------
 * PLACEHOLDER SOCIAL PROOF — none of these are real partners.
 * Swap for supplied wordmark SVGs; the grid and band height stay as they are.
 * ------------------------------------------------------------------------- */
const logos = [
  "CKE arkusze",
  "Perspektywy",
  "OKE Kraków",
  "Szkoła 2027",
  "Matura Plus",
  "Kuratorium",
  "EduLab",
  "Olimpiada MAT",
  "Korepetytorzy.pl",
  "Portal Uczeń",
];

/**
 * The reference's logo wall: two rows of five monochrome wordmarks in a
 * 159px band, hairline-bordered top and bottom, inside the 1080px frame.
 * Logos are desaturated so the page's accents stay dominant (DESIGN.md).
 */
export function LogoWall() {
  return (
    <section
      aria-label="Zaufali nam"
      className="col-rules border-t border-ash bg-white"
    >
      <Container>
        <div className="grid h-[159px] grid-cols-5 grid-rows-2 items-center gap-x-6">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-center font-satoshi text-body font-bold tracking-tight text-fog transition-colors duration-200 hover:text-graphite"
            >
              {logo}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
