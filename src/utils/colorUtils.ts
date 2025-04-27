import { Color } from "../types/reportTypes";

export const COLOR_MAP: Record<Color, string> = {
  azul: "FF4F81BD",
  verde: "FF9BBB59",
  vermelho: "FFC0504D",
  amarelo: "FFFFC000",
  roxo: "FF8064A2",
};

export function getColorHex(color: Color = "verde"): string {
  return COLOR_MAP[color] || "FFFFFF00";
}
