import IntroductionWrapper from "@/components/mainpage/IntroductionWrapper";
import Projects from "@/components/mainpage/Projects";
import { TypewriterEffectHero } from "@/components/mainpage/TypewriterEffectHero";


export default function HomePage() {
 

  return (
    <>
     <TypewriterEffectHero />
     <IntroductionWrapper />
      <Projects />
    </>
  );
}