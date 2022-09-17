import * as React from "react";
import { SVGProps } from "react";

const Default = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="210mm"
    height="297mm"
    viewBox="0 0 210 297"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g transform="translate(48.613 8.161)">
      <path
        style={{
          fill: "#bba8db",
          fillRule: "evenodd",
          stroke: "#fff",
          strokeWidth: 0.367772,
        }}
        d="M99.816 126.158A49.816 49.816 0 0 1 50 175.974 49.816 49.816 0 0 1 .184 126.158 49.816 49.816 0 0 1 50 76.342a49.816 49.816 0 0 1 49.816 49.816Z"
      />
      <circle
        style={{
          fill: "#8442f7",
          fillOpacity: 1,
          fillRule: "evenodd",
          stroke: "#fff",
          strokeWidth: 0.147109,
          strokeOpacity: 0,
        }}
        cy={117.206}
        cx={50}
        r={19.926}
      />
      <path
        style={{
          fill: "#8442f7",
          fillRule: "evenodd",
          stroke: "#fff",
          strokeWidth: 0.299617,
          strokeOpacity: 0,
        }}
        d="M63.326 135.265A22.417 22.417 0 0 1 50 139.675a22.417 22.417 0 0 1-13.22-4.332 29.85 44.849 0 0 0-15.91 31.116 49.816 49.816 0 0 0 29.232 9.519 49.816 49.816 0 0 0 29.242-9.527 29.85 44.849 0 0 0-16.018-31.186z"
      />
    </g>
  </svg>
);

export default Default;
