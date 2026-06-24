import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieViewWeb = ({ source, loop, autoPlay, style }) => {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      const animation = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: loop !== false,
        autoplay: autoPlay !== false,
        animationData: source,
      });

      return () => animation.destroy();
    }
  }, [source]);

  // Map React Native style object to Web style object
  const webStyle = {
    width: style?.width || "100%",
    height: style?.height || "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto", // Centers horizontally in the web container
    ...style,
  };

  return <div ref={container} style={webStyle} />;
};

export default LottieViewWeb;
