import ApproachWrapper from "@/components/mainpage/ApproachWrapper";
import IntroductionWrapper from "@/components/mainpage/IntroductionWrapper";
import MyServices from "@/components/mainpage/MyServices";
import OutroSection from "@/components/mainpage/OutroSection";
import Projects from "@/components/mainpage/Projects";
import { TypewriterEffectHero } from "@/components/mainpage/TypewriterEffectHero";


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
     <TypewriterEffectHero />
     <IntroductionWrapper />
     <MyServices />
      <Projects locale={locale} />
      <ApproachWrapper />
      <OutroSection />
    </>
  );
}
