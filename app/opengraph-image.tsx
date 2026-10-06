import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SHARE_IMAGE } from "@/lib/seo";

/*
 * The share card every page uses, on Open Graph and X: the landing hero on its grid — mark and wordmark, the headline, the
 * line under it. Rendered once at build time into a static PNG. ImageResponse
 * cannot read woff2, so the display face is the same Satoshi as TTF.
 */

export const alt = SHARE_IMAGE.alt;
export const size = { width: SHARE_IMAGE.width, height: SHARE_IMAGE.height };
export const contentType = SHARE_IMAGE.type;

const [satoshiMedium, satoshiBold] = await Promise.all([
  readFile(join(process.cwd(), "fonts/Satoshi-Medium.ttf")),
  readFile(join(process.cwd(), "fonts/Satoshi-Bold.ttf")),
]);

const INK = "#0a0a0a";
const CHARCOAL = "#171717";
const STEEL = "#525252";
const FOG = "#737373";
const RULE = "rgba(0, 0, 0, 0.045)";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          backgroundImage: `linear-gradient(to right, ${RULE} 1px, transparent 1px), linear-gradient(to bottom, ${RULE} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          fontFamily: "Satoshi",
        }}
      >
        {/* The hero's mask: the grid dies out well before the edges. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse 70% 75% at 50% 45%, rgba(255,255,255,0) 40%, #ffffff 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, color: INK }}>
          <svg width={44} height={40} viewBox="0 0 224 202" fill="currentColor">
            <path d="M52 0h172l-52 54H0z" />
            <path d="M52 74h172l-52 54H0z" />
            <path d="M52 148h172l-52 54H0z" />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.025em" }}>Examax</span>
        </div>

        <div
          style={{
            marginTop: 52,
            maxWidth: 1000,
            textAlign: "center",
            fontSize: 68,
            fontWeight: 500,
            lineHeight: 1.15,
            color: CHARCOAL,
          }}
        >
          Twoje braki. Twoje zadania. Twój wynik.
        </div>

        <div
          style={{
            marginTop: 28,
            maxWidth: 900,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.4,
            color: STEEL,
          }}
        >
          Examax znajduje pytania, w których się mylisz, i buduje z nich Twój osobisty trening przed egzaminem ósmoklasisty i maturą.
        </div>

        <div style={{ position: "absolute", bottom: 44, display: "flex", fontSize: 24, fontWeight: 500, color: FOG }}>examax.app</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Satoshi", data: satoshiMedium, style: "normal", weight: 500 },
        { name: "Satoshi", data: satoshiBold, style: "normal", weight: 700 },
      ],
    },
  );
}
