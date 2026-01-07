'use client'
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const SocialBanner = ({
  className,
  containerClassName,
}: {
  textClassName?: string;
  className?: string;
  showStars?: boolean;
  containerClassName?: string;
}) => {
  const images = [
    {
      name: "GitHub",
      src: "https://wp.zivic-elektro.shop/wp-content/uploads/2025/05/270-151-scaled-1.jpg",
    },
    {
      name: "Facebook",
      src: "https://wp.zivic-elektro.shop/wp-content/uploads/2025/04/16.36.052.jpg",
    },
    {
      name: "Instagram",
      src: "https://wp.zivic-elektro.shop/wp-content/uploads/2025/04/12.23.051.jpg",
    },
    {
      name: "LinkedIn",
      src: "https://wp.zivic-elektro.shop/wp-content/uploads/2025/04/trofazno-monofazni-razvodnik.jpg",
    },
    {
      name: "Email",
      src: "https://wp.zivic-elektro.shop/wp-content/uploads/2025/04/17.01.007.jpg",
    },
    {
      name: "Mobile",
      src: "https://wp.zivic-elektro.shop/wp-content/uploads/2025/04/05.63.81.jpg",
    },
  ];
  return (
    <div className={cn("flex flex-col items-center mt-0 lg:mt-14 md:mt-10", containerClassName)}>
      <div
        className={cn(
          "mb-2 lg:my-16 flex flex-col items-center justify-center sm:flex-row",
          className,
        )}
      >
        <div className="mb-4 flex flex-row items-center sm:mb-0">
          {images.map((image) => (
            <div className="group relative -mr-4" key={image.name}>
              <div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden rounded-full border-2 border-sky-500"
                >
                  <Image
                    height={100}
                    width={100}
                    src={image.src}
                    alt={image.name}
                    priority
                    className="h-8 w-8 object-cover object-top md:h-14 md:w-14"
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};