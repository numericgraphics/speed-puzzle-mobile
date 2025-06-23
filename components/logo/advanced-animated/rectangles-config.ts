// config/rectanglesConfig.ts
export interface RectDimensions {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
}

export const rectanglesConfig: RectDimensions[] = [
  { id: "top", x: 36, y: 20, width: 120, height: 40, strokeWidth: 15 },
  { id: "middle", x: 36, y: 80, width: 120, height: 40, strokeWidth: 10 },
  { id: "bottom", x: 36, y: 135, width: 120, height: 40, strokeWidth: 5 },
];
