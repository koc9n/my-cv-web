import { ImageResponse } from "next/og";
export const alt = "Kostiantyn Mironchyk - Senior Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#f6f4ee",
        color: "#17231f",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#bb4d2e",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Senior software engineering
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: -4,
          }}
        >
          Kostiantyn Mironchyk
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 20 }}>
          Senior Full Stack Developer
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#5d6964" }}>
        Java · Spring Boot · Node.js · Angular · AWS
      </div>
    </div>,
    size,
  );
}
