import React from "react";

export default function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{
        opacity: 0.35,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' seed='1' stitchTiles='stitch'%3E%3Canimate attributeName='baseFrequency' dur='30s' values='0.75;0.8;0.85;0.8;0.75' repeatCount='indefinite' /%3E%3Canimate attributeName='seed' dur='2s' values='1;2;3;4;5;6;7;8;9;1' repeatCount='indefinite' /%3E%3Canimate attributeName='numOctaves' dur='15s' values='4;5;6;5;4' repeatCount='indefinite' /%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: "150px 150px",
      }}
    />
  );
}
