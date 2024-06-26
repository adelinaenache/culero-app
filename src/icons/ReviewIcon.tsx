import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const ReviewIcon = ({
  size = 15,
  color,
  ...props
}: SvgProps & { size?: number }) => {
  return (
    <Svg
      width={size + 4}
      height={size}
      viewBox="0 0 28 24"
      fill="none"
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M26 .937L24.897.299a2.236 2.236 0 00-3.051.817l-2.529 4.38H5.076L1.487 3.105A.957.957 0 000 3.9v16.59A3.513 3.513 0 003.51 24h14.547a3.513 3.513 0 003.51-3.51v-7.406l5.251-9.097a2.236 2.236 0 00-.817-3.05zM19.653 20.49c0 .88-.715 1.595-1.595 1.595H3.51c-.88 0-1.595-.716-1.595-1.595V5.689l2.34 1.56c.158.106.343.161.531.161h13.426l-3.483 6.033-.498 4.176H4.785a.957.957 0 000 1.915h10.238a.94.94 0 00.63-.191l4-2.992v4.14zm-1.412-5.474l-1.945 1.455.287-2.412 4.847-8.395 1.658.957-4.847 8.395zM25.16 3.03l-1.116 1.934-1.658-.957 1.117-1.934a.32.32 0 01.436-.116l1.105.638a.32.32 0 01.116.435z"
        fill={color}
      />
      <Path
        d="M4.785 15.705h6.891a.957.957 0 000-1.914h-6.89a.957.957 0 000 1.914zM4.785 11.876h6.891a.957.957 0 000-1.914h-6.89a.957.957 0 000 1.914z"
        fill={color}
      />
    </Svg>
  );
};
