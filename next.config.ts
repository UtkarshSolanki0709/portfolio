import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'three',
      '@react-three/drei',
      '@react-three/fiber',
      '@react-three/postprocessing',
      'gsap',
      'howler',
      'lucide-react',
      'sonner',
      'zustand',
      'radix-ui',
    ],
  },
};

export default nextConfig;
