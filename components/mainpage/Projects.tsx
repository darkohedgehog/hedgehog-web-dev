import { AnimatedPin } from './AnimatedPin'
import { useTranslations } from 'next-intl';

const Projects = () => {
  const t = useTranslations('Projects');
  return (
    <div className='py-16 max-w-7xl mx-auto'>
      <div className='flex items-center justify-center flex-col'>
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
        <AnimatedPin />
    </div>
  )
}

export default Projects