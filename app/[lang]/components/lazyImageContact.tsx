"use client"

import { Loader } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export const LazyImageContact = ({ src, alt }: { src: string; alt: string; }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex items-center justify-center h-full w-full">
        {/* Loader */}
        {isLoading && (
            <div className="absolute flex items-center justify-center z-0 w-10 h-10">
                <Loader className="animate-spin text-gray-500" size={20} />
            </div>
        )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        className="object-cover h-full"
        onLoad={() => setIsLoading(false)}
        priority
      />
    </div>
  );
};