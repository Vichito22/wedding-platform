import { ImageResponse } from "next/og";

import { AMBER, COUPLE, VENUE, WEDDING_DATE_LABEL } from "@/app/siteConfig";
import { ringsMarkDataUri } from "@/app/ringsMark";

export const alt = `${COUPLE} — ${WEDDING_DATE_LABEL}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const [first, second] = COUPLE.split(" & ");

  // Satori sólo entiende un subconjunto de CSS: flexbox sí, grid no, y todo
  // contenedor con varios hijos necesita `display: flex` explícito.
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top, #fff7ed 0%, #f8fafc 45%, #eef2ff 100%)",
          color: "#020617",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ringsMarkDataUri({ strokeWidth: 1.7 })}
          width={140}
          height={140}
          alt=""
        />

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: -2,
          }}
        >
          <span>{first}</span>
          <span style={{ color: AMBER, margin: "0 24px" }}>&amp;</span>
          <span>{second}</span>
        </div>

        <div
          style={{
            width: 128,
            height: 2,
            marginTop: 36,
            background: AMBER,
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 34,
            letterSpacing: 10,
            color: "#475569",
          }}
        >
          {WEDDING_DATE_LABEL.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#64748b",
          }}
        >
          {VENUE}
        </div>
      </div>
    ),
    size,
  );
}
