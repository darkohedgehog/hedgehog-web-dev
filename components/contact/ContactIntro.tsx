import { useTranslations } from 'next-intl';

const ContactIntro = () => {
    const t = useTranslations('ContactIntro');
  return (
    <div className='flex items-center justify-center flex-col gap-1 mt-6 lg:mt-10 md:mt-10'>
        <h1 className='text-2xl lg:text-4xl uppercase font-semibold text-sky-400'>
            {t('title')}
        </h1>
        <p className='text-xl lg:text-3xl font-semibold text-sky-200 text-center mb-6 lg:mb-1 md:mb-1'>
            {t('description')}
        </p>
    </div>
  )
}

export default ContactIntro;