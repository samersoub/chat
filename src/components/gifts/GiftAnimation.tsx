"use client";

import React from "react";
import { Player } from "lottie-react";

type GiftAnimationProps = {
  type: "rose" | "car" | "dragon";
  className?: string;
};

const sources: Record<GiftAnimationProps["type"], string> = {
  rose: "/lottie/rose.json",
  car: "/lottie/car.json",
  dragon: "/lottie/dragon.json",
};

const GiftAnimation: React.FC<GiftAnimationProps> = ({ type, className }) => {
  return (
    <div className={className}>
      <Player
        src={sources[type]}
        autoplay
        loop={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default GiftAnimation;