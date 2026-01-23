"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LottieAnimation = () => {
  return (
    <DotLottieReact
      src="/hedgehogcontact.lottie"
      loop
      autoplay
      style={{ width: "100%", height:"100%"}}
    />
  );
};

export default LottieAnimation;