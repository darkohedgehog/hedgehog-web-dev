import React from 'react'
import { useTranslations } from 'next-intl';

const CookiesStatement = () => {
  const t = useTranslations('CookiesStatement');
  return (
    <div className='p-4 my-16 text-sky-200 border-2 border-cyan-300/60 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 rounded-2xl mx-4 lg:mx-20'>
     <h2 className='flex items-center justify-center text-sky-400 font-bold uppercase text-2xl my-8'>
        {t('title1')}
    </h2>
    <p className='mt-2'>
    {t('paragraph1')}
    </p>
    <p className='mt-2'>
    {t('paragraph2')}
    </p>
    <p className='mt-2'>
    {t('paragraph3')}
    </p>
    <p className='mt-2'>
    {t('paragraph4')}
    </p>
    <p className='mt-2'>
    {t('paragraph5')}
    </p>
    <p className='mt-2'>
    {t('paragraph6')}
    </p>
    <p className='mt-2 text-sky-300'>
    {t('paragraph7')}
    </p>
    </div>
  )
}

export default CookiesStatement;