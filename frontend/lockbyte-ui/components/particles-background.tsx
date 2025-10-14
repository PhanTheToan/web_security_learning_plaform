"use client";
import { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import {
  type Container,
  type ISourceOptions,
  type Engine,
} from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const ParticlesComponent = (props: { id: string }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#252d47",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 1,
          },
          repulse: {
            distance: 150,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#9747ff",
        },
        links: {
          color: "#5a5bed",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 125,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return (
    <Particles
      id={props.id}
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      className="-z-10"
    />
  );
};

export default ParticlesComponent;
