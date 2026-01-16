'use client'
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
      src: "/assets/github.png",
      link: "https://github.com/darkohedgehog"
    },
    {
      name: "Facebook",
      src: "/assets/facebook.png",
      link: "https://www.facebook.com/messages/t/100074828598715/?locale=hr_HR"
    },
    {
      name: "Instagram",
      src: "/assets/instagram.png",
      link: "https://www.instagram.com/hedgehog_web_developer/"
    },
    {
      name: "LinkedIn",
      src: "/assets/linkedin.png",
      link: "https://www.linkedin.com/in/darko-%C5%BEivi%C4%87/"
    },
    {
      name: "Email",
      src: "/assets/email.png",
      link: "mailto:zivic.darko79@gmail.com"
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
                <Link
                  href={image.link ? image.link : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    height={100}
                    width={100}
                    src={image.src}
                    alt={image.name}
                    priority
                    className="h-8 w-8 object-cover object-top md:h-14 md:w-14"
                  />
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};