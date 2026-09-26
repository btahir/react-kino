import { ImageResponse } from "next/og";
export const alt = "Kino — React scroll stories. Visual timing. Your source.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 65,
          background: "#f2eee5",
          color: "#203d33",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 62, fontWeight: 700, letterSpacing: -4 }}>
            kino
          </span>
          <span style={{ fontSize: 18, letterSpacing: 3 }}>
            REACT SCROLL STORYTELLING
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            lineHeight: 1.06,
            letterSpacing: -4,
          }}
        >
          <span>Give your story</span>
          <span style={{ color: "#637b68" }}>a sense of motion.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
          }}
        >
          <span>Visual timing. Portable documents. Your code.</span>
          <span>Free & MIT licensed ↗</span>
        </div>
      </div>
    ),
    size,
  );
}
