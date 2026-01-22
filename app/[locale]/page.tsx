import ApproachWrapper from "@/components/mainpage/ApproachWrapper";
import IntroductionWrapper from "@/components/mainpage/IntroductionWrapper";
import OutroSection from "@/components/mainpage/OutroSection";
import Projects from "@/components/mainpage/Projects";
import { TypewriterEffectHero } from "@/components/mainpage/TypewriterEffectHero";


export default function HomePage() {
 

  return (
    <>
     <TypewriterEffectHero />
     <IntroductionWrapper />
      <Projects />
      <ApproachWrapper />
      <OutroSection />
    </>
  );
}