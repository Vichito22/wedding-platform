import { ImageResponse } from "next/og";

import { CREAM } from "@/app/siteConfig";
import { ringsMarkDataUri } from "@/app/ringsMark";

// iOS ignora el SVG al guardar el sitio en la pantalla de inicio y pide un PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ringsMarkDataUri()} width={136} height={136} alt="" />
      </div>
    ),
    size,
  );
}
