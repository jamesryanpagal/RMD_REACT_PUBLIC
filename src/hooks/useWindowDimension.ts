import { useEffect, useState } from "react";

const enum BREAK_POINTS {
  SM = 640,
  MD = 768,
  LG = 1024,
}

export type Dimension = {
  width: number;
  height: number;
  sm: boolean;
  md: boolean;
  lg: boolean;
};

export type DimensionType = Pick<Dimension, "sm" | "md" | "lg">;

export const useWindowDimension = () => {
  const onGetType = (width: number): DimensionType => {
    const device: DimensionType = {
      sm: false,
      md: false,
      lg: false,
    };
    if (width >= BREAK_POINTS.LG) {
      device.lg = true;
    } else if (width > BREAK_POINTS.MD) {
      device.md = true;
    } else {
      device.sm = true;
    }

    return device;
  };

  const [dimension, setDimension] = useState<Dimension>({
    width: window.innerWidth,
    height: window.innerHeight,
    ...onGetType(window.innerWidth),
  });
  useEffect(() => {
    const onResize = () => {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;
      setDimension(prev => ({
        ...prev,
        width: innerWidth,
        height: innerHeight,
        ...onGetType(innerWidth),
      }));
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return dimension;
};
