import { useTranslations } from 'next-intl';

const Privacy = () => {
    const t = useTranslations('Privacy');
  return (
    <div className='p-4 my-16 text-sky-200 border-2 border-cyan-300/60 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 rounded-2xl mx-4 lg:mx-20'>
    <h2 className='flex items-center justify-center text-sky-500 font-bold uppercase text-2xl my-8'>
       {t('title1')}
    </h2>
     <p className='mt-4'>
     {t('paragraph1')}
     </p>
     <p className='mt-2'>
     {t('paragraph2')}
     </p>
     <h3 className='text-sky-400 mt-4 font-semibold uppercase'>
     {t('title2')}
     </h3>
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
     <h3 className='text-sky-400 my-4 font-semibold uppercase'>
     {t('title3')}
     </h3>
     <p className='mt-2'>
     {t('paragraph7')}
     </p>
     <p className='mt-2'>
     {t('paragraph8')}
     </p>
     <p className='mt-2'>
     {t('paragraph9')}
     </p>
     <p className='mt-2'>
     {t('paragraph10')}
     </p>
     <p className='mt-2'>
     {t('paragraph11')}
     </p>
     <p className='mt-2'>
     {t('paragraph12')}
     </p>
     <p className='mt-2'>
     {t('paragraph13')}
     </p>
     <p className='mt-2'>
     {t('paragraph14')}
     </p>
     <p className='mt-2'>
     {t('paragraph15')}
     </p>
     <p className='mt-2'>
     {t('paragraph16')}
     </p>
     <p className='mt-2'>
     {t('paragraph17')}
     </p>
     <p className='mt-2'>
     {t('paragraph18')}
     </p>
     <p className='mt-2'>
     {t('paragraph19')}
     </p>
     <p className='mt-2'>
     {t('paragraph20')}
     </p>
     <p className='mt-2'>
     {t('paragraph21')}
     </p>
    </div>
  )
}

export default Privacy;