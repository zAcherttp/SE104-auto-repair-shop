"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Simple FadeLoader component
interface FadeLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  duration?: number;
  className?: string;
}

export const FadeLoader = ({
  isLoading,
  children,
  fallback = <div>Loading...</div>,
  duration = 0.3,
  className = "",
}: FadeLoaderProps) => {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration }}
          >
            {fallback}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for easy integration with TanStack Query
export const useFadeQuery = (queryOptions: any) => {
  const query = useQuery(queryOptions);

  return {
    ...query,
    FadeWrapper: ({
      children,
      fallback,
      className,
    }: {
      children: React.ReactNode;
      fallback?: React.ReactNode;
      className?: string;
    }) => (
      <FadeLoader
        className={className}
        fallback={fallback}
        isLoading={query.isLoading}
      >
        {children}
      </FadeLoader>
    ),
  };
};
