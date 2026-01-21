import { Introduction } from './Introduction'
import { useTranslations } from 'next-intl';

const IntroductionWrapper = () => {

  const t = useTranslations('IntroductionWrapper');

  return (
    <div className='md:mt-64 lg:mt-64 pt-8'>
     <div className='flex items-center justify-center flex-col mb-12'>
     <p className='mb-4 text-center text-3xl font-bold text-sky-400'>
        <span className='mr-1'>{t('title1')}</span>
        <span className='mx-1 text-accent'>{t('title2')}</span>
        <span className='ml-1'>{t('title3')}</span>
     </p>
     <p className='mb-6 text-center text-2xl font-semibold text-sky-200'>
        <span className='mr-1'>{t('title4')}</span>
        <span className='mx-1 text-accent'>{t('title5')}</span>
        <span className='ml-1'>{t('title6')}</span>
     </p>
    </div>
      <Introduction />
    </div>
  )
}

export default IntroductionWrapper