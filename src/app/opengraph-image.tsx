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
        justifyContent: "center",
        padding: "72px",
        background: "#0b0b14",
        color: "#f4f2ff",
        fontFamily: "Arial",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            color: "#d2c2ff",
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
      <div
        style={{
          display: "flex",
          fontSize: 24,
          marginTop: 32,
          color: "#87e4f7",
        }}
      >
        Java · Spring Boot · Node.js · Angular · AWS
      </div>
    </div>,
    size,
  );
}
