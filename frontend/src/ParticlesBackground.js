import React from "react";
import Particles from "react-tsparticles";

function ParticlesBackground() {
  return (
    <Particles
      options={{
        fullScreen: { enable: true },
        background: {
          color: "#0f2027",
        },
        particles: {
          number: {
            value: 80,
          },
          color: {
            value: "#ffffff",
          },
          links: {
            enable: true,
            color: "#ffffff",
          },
          move: {
            enable: true,
            speed: 2,
          },
          size: {
            value: 3,
          },
        },
      }}
    />
  );
}

export default ParticlesBackground;
