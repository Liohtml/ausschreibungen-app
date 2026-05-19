"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Milestone {
  id: number;
  name: string;
  description: string;
  status: "complete" | "in-progress" | "pending";
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

interface AnimatedRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
  milestones: Milestone[];
}

const MilestoneMarker = ({ milestone }: { milestone: Milestone }) => {
  const statusClasses = {
    complete: "bg-[#3B82F6] border-[#2563EB]",
    "in-progress": "bg-[#3B82F6] border-[#2563EB] animate-pulse",
    pending: "bg-gray-200 border-gray-300",
  };

  const ringClasses = {
    complete: "bg-[#3B82F6]/10",
    "in-progress": "bg-[#3B82F6]/15",
    pending: "bg-gray-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: milestone.id * 0.3,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: 0.8 }}
      className="absolute flex items-center gap-3"
      style={milestone.position}
    >
      <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
        <div
          className={cn(
            "absolute h-4 w-4 rounded-full border-2",
            statusClasses[milestone.status]
          )}
        />
        <div
          className={cn(
            "absolute h-full w-full rounded-full",
            ringClasses[milestone.status]
          )}
        />
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
        <p className="text-sm font-semibold text-[#1E293B]">
          {milestone.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{milestone.description}</p>
      </div>
    </motion.div>
  );
};

const AnimatedRoadmap = React.forwardRef<HTMLDivElement, AnimatedRoadmapProps>(
  ({ className, milestones, ...props }, ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);

    return (
      <div
        ref={targetRef}
        className={cn("relative w-full max-w-4xl mx-auto", className)}
        {...props}
      >
        <div className="relative h-[420px] md:h-[400px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
            className="absolute top-0 left-0"
          >
            {/* Background path (dashed, light) */}
            <path
              d="M 50 350 Q 200 50 400 200 T 750 100"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
            {/* Animated foreground path */}
            <motion.path
              d="M 50 350 Q 200 50 400 200 T 750 100"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="8 6"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {milestones.map((milestone) => (
            <MilestoneMarker key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    );
  }
);

AnimatedRoadmap.displayName = "AnimatedRoadmap";

export { AnimatedRoadmap };
