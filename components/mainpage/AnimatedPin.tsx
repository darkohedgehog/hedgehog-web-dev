"use client";
import { PinContainer } from "../ui/Pin";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';


export function AnimatedPin() {
  const t = useTranslations('AnimatedPin');
  const projects = [
    {
      title: "Živić-elektro",
      description: (<span>{t('description1')}</span>),
      image: "/assets/home.jpeg",
      github: "https://github.com/darkohedgehog/nextjs-wp-shop",
      live: "https://zivic-elektro.shop",
      technologies: ["Next.js", "WordPress", "Motion","TailwindCss"],
    },
    {
      title: "@Dizajn",
      description: (<span>{t('description2')}</span>),
      image: "/assets/dizajn.png",
      github: "https://github.com/darkohedgehog/dizajn-studio",
      live: "https://reklame-dizajn.vercel.app/",
      technologies: ["Next.js", "Sanity","Framer Motion"],
    },
    {
      title: "Mi-Go Kombucha",
      description: (<span>{t('description5')}</span>),
      image: "/assets/mi-go-malina.webp",
      github: "https://github.com/darkohedgehog/mi-go",
      live: "https://www.migo-kombucha.com",
      technologies: ["Next.js", "Shadcn/ui", "TailWindCss", "Framer Motion"],
    },
    {
      title: "Srpski kulturni centar Vukovar",
      description: (<span>{t('description6')}</span>),
      image: "/assets/skc-banner.png",
      github: "https://github.com/darkohedgehog/skc-frontend",
      live: "https://www.skcvukovar.hr",
      technologies: ["Next.js", "TailWindCss", "Motion","Strapi"],
    },
    {
      title: "Kreditni savetnik",
      description: (<span>{t('description4')}</span>),
      image: "/assets/social-media.png",
      github: "https://github.com/darkohedgehog/kreditni-savetnik",
      live: "https://savetnikzakredite.vercel.app/",
      technologies: ["Next.js", "Shadcn/ui", "TailWindCss"],
    },
    {
      title: "Portfolio",
      description: (<span>{t('description3')}</span>),
      image: "/assets/portfolio1.jpg",
      github: "https://github.com/darkohedgehog/Dragana-portfolio",
      live: "https://dragana-portfolio.vercel.app/",
      technologies: ["Vite", "TailwindCss", "Framer Motion"],
    },
  ];

  return (
    <div className="h-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 mx-auto items-center p8-8 md:mt-28 lg:mt-28">
      {projects.map((project, index) => (
        <PinContainer
          key={index}
          title={project.title}
          href={project.live}
        >
          <div className="flex flex-col p-4 tracking-tight text-cyan-300 w-[20rem] h-80 lg:w-[24rem] lg:h-88">
            <h3 className="max-w-xs pb-2 m-0 font-bold text-base text-accent dark:text-accentDark">
              {project.title}
            </h3>
            <div className="text-base m-0 p-0 font-normal">
              <span className="text-cyan-500">
                {project.description}
              </span>
            </div>
            {project.image && (
              <div>
                <Image
                  src={project.image}
                  width={100}
                  height={100}
                  alt={project.title}
                  priority
                  className="w-full h-32 rounded-md object-cover object-center" />
              </div>
            )}
            <div className="flex items-center justify-center mt-4 gap-6">
              <Link 
               href={project.github}
               target="_blank"
               className="text-blue-400 hover:underline">
                  GitHub
              </Link>
              <Link 
              href={project.live}
              target="_blank"
              className="text-blue-400 hover:underline">
                  Live Site
              </Link>
            </div>
            <div className="flex mt-5 space-x-2">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="text-xs text-cyan-300 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </PinContainer>
      ))}
    </div>
  );
}