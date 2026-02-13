"use client"
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FaLocationArrow } from "react-icons/fa6";

const OutroSection = () => {

    const t = useTranslations('OutroSection');
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const currentLocale = pathSegments[1] || 'hr';
    const localizedPath = `/${currentLocale}${'/contact'}`;

  return (
    <div className="flex flex-col items-center py-16 max-w-6xl mx-auto">
        <h2 className="text-center lg:max-w-[45vw] text-4xl font-bold text-sky-400">
        {t('title1')} <span className="text-sky-200 text-4xl">{t('title2')}</span> {t('title3')}
        </h2>
        <p className="md:mt-10 my-5 text-center text-2xl text-light font-bold text-sky-200">
        {t('title4')}
        </p>
        <Link href={localizedPath}>
        <button className="relative inline-flex h-12 w-50 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-sky-300 backdrop-blur-3xl gap-3">
    {t('title5')}
    <FaLocationArrow aria-hidden="true" />
    </span>
    </button>
        </Link>
      </div>
  )
}

export default OutroSection
