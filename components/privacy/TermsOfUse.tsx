import React from 'react';
import { useTranslations } from 'next-intl';

const TermsOfUse = () => {
    const t = useTranslations('TermsOfUse');
  return (
    <div className='p-4 my-16 text-sky-200 border-2 border-cyan-300/60 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 rounded-2xl mx-4 lg:mx-20'>
     <h2 className='flex items-center justify-center text-sky-400 font-bold uppercase text-2xl my-8'>
        {t('title1')}
    </h2>
    <h3 className='flex items-center justify-center text-sky-300 font-semibold uppercase text-xl my-4'>
        {t('title2')}
    </h3>
    <p className='mt-2'>
        {t('paragraph1')}
    </p>
    <p className='mt-2'>
        {t('paragraph2')}
    </p>
    <h3 className='flex items-center justify-center text-sky-300 font-semibold uppercase text-xl my-4'>
        2{t('title3')}
    </h3>
    <p className='mt-2'>
        {t('paragraph3')}
    </p>
    <p className='mt-2'>
        {t('paragraph4')}
    </p>
    <p className='mt-2 font-bold'>
        {t('paragraph5')}
    </p>
    <p className='mt-2'>
        {t('paragraph6')}
    </p>
    <h3 className='flex items-center justify-center text-sky-300 font-semibold uppercase text-xl my-4'>
       {t('title4')}
    </h3>
    <p className='mt-2 font-semibold'>
       {t('paragraph7')}
    </p>
    <p className='mt-2 font-semibold'>
       {t('paragraph8')}
    </p>
    <p className='mt-2 font-semibold'>
       {t('paragraph9')}
    </p>
    <p className='mt-2 font-semibold'>
       {t('paragraph10')}
    </p>
    <p className='mt-2 font-semibold'>
       {t('paragraph11')}
    </p>
    <h3 className='flex items-center justify-center text-sky-300 font-semibold uppercase text-xl my-4'>
    {t('title5')}
    </h3>
    <p className='mt-2'>
       {t('paragraph12')}
    </p>
    <p className='mt-2'>
       {t('paragraph13')}
    </p>
    <p className='mt-2'>
       {t('paragraph14')}
    </p>
    <h3 className='flex items-center justify-center text-sky-300 font-semibold uppercase text-xl my-4'>
        {t('title6')}
    </h3>
    <p className='mt-2'>
        {t('paragraph15')}
    </p>
    </div>
  )
}

export default TermsOfUse;