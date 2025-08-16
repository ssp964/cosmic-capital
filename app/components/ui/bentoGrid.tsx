"use client";
import React, { use } from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Cross-Chain Liquidation",
      description:
        "Detect risks on any chain → liquidate instantly on Hedera's fast, low-cost EVM. Protect lenders before collateral crashes.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r border-emerald-200/30 dark:border-emerald-800/30",
    },
    {
      title: "Risk Mitigation",
      description:
        "Stop bad debt before it snowballs. Lenders are safeguarded, borrowers are incentivized to maintain healthy positions.",
      skeleton: <SkeletonTwo />,
      className:
        "border-b col-span-1 lg:col-span-2 border-emerald-200/30 dark:border-emerald-800/30",
    },
    {
      title: "Watch our demo",
      description: "Click to see how Cosmic Capital works in action.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r border-emerald-200/30 dark:border-emerald-800/30",
    },
    {
      title: "Hyperlane Messaging",
      description:
        "Seamless permissionless interoperability: send secure liquidation triggers across chains in seconds.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <div className="text-center mb-16">
          <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Packed with Cross-Chain Superpowers
          </h4>

          <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            From real-time loan monitoring to instant liquidation execution,
            Cosmic Capital is built to make DeFi lending safer. Our protocol
            indexes loan health factors across multiple chains, detects
            undercollateralized positions, and triggers fast liquidations on
            Hedera’s low-cost, high-speed network.
          </p>
        </div>
      </div>

      <div className="relative px-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 backdrop-blur-sm bg-gradient-to-br from-white/60 via-emerald-50/40 to-white/60 dark:from-black/60 dark:via-emerald-950/40 dark:to-black/60 xl:border-2 border-emerald-200/40 dark:border-emerald-800/40 rounded-3xl shadow-2xl overflow-hidden">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `p-6 sm:p-10 relative overflow-hidden group hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all duration-300`,
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-6 mx-auto bg-gradient-to-br from-white/90 via-emerald-50/80 to-white/90 dark:bg-gradient-to-br dark:from-emerald-950/90 dark:via-black/80 dark:to-emerald-950/90 backdrop-blur-sm shadow-2xl group h-full rounded-2xl border border-emerald-200/40 dark:border-emerald-800/40">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          <img
            src="/linear.webp"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-xl"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <a
      href="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="__blank"
      className="relative flex gap-10 h-full group/image"
    >
      <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-5"></div>
          <IconBrandYoutubeFilled className="h-24 w-24 absolute z-10 inset-0 text-red-500 m-auto drop-shadow-2xl group-hover/image:scale-110 transition-transform duration-200" />
          <img
            src="https://assets.aceternity.com/fireship.jpg"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-xl blur-none group-hover/image:blur-md transition-all duration-200 border-2 border-emerald-200/40 dark:border-emerald-800/40"
          />
        </div>
      </div>
    </a>
  );
};

export const SkeletonTwo = () => {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-2xl -mr-4 mt-4 p-2 bg-gradient-to-br from-white/90 to-emerald-50/90 dark:bg-gradient-to-br dark:from-emerald-950/90 dark:to-black/90 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-800/50 shrink-0 overflow-hidden shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-800/50 transition-shadow duration-300"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-xl h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-2xl -mr-4 mt-4 p-2 bg-gradient-to-br from-white/90 to-emerald-50/90 dark:bg-gradient-to-br dark:from-emerald-950/90 dark:to-black/90 backdrop-blur-sm border-2 border-emerald-200/50 dark:border-emerald-800/50 shrink-0 overflow-hidden shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-800/50 transition-shadow duration-300"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-xl h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 pr-10 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.3, 0.2], // Darker emerald base
      markerColor: [0.2, 0.8, 0.4], // Emerald markers
      glowColor: [0.3, 0.9, 0.5], // Emerald glow
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
