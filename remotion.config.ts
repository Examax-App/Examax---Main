import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

/*
 * Remotion's render setup for the Examax launch film
 * (`components/launch-film/`, entry `remotion/index.ts`). Rendered with
 * `pnpm film:render`; the site plays the resulting MP4.
 *
 * The bundle is webpack, not Next: Tailwind v4 comes in through Remotion's
 * plugin, `@/` resolves to the repo root as it does in tsconfig, and
 * `next/image` is swapped for a plain <img> (`remotion/shims/next-image.tsx`).
 */

Config.setEntryPoint("remotion/index.ts");
Config.setPublicDir("remotion/public");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
// Tagged BT.709, limited range: what YouTube, Instagram, TikTok and X expect for HD.
Config.setColorSpace("bt709");
Config.setAudioCodec("aac");
Config.setAudioBitrate("256k");

Config.overrideWebpackConfig((current) => {
  const config = enableTailwind(current);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@": path.resolve(process.cwd()),
        "next/image$": path.resolve(process.cwd(), "remotion/shims/next-image.tsx"),
      },
    },
  };
});
