import Link from 'next/link';
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { useTranslations } from 'next-intl';

const Complaint = () => {
    const t = useTranslations('Complaint');
  return (
    <div className='p-4 my-16 text-sky-400 border-2 border-cyan-300/60 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 rounded-2xl mx-4 lg:mx-20'>
     <h2 className='flex items-center justify-center text-sky-400 font-bold uppercase text-2xl my-8'>
        {t('title')}
    </h2>
    <p className='mt-4 text-xl font-semibold text-sky-200'>
        {t('paragraph1')}
    </p>
    <p className='my-6 text-sky-400 text-xl'> 
        {t('paragraph2')}
    </p>
    <ul className='list-disc list-outside text-sky-300 ml-4'>
      <li>{t('li1')}</li>
      <li>{t('li2')}</li>
      <li>{t('li3')}</li>
      <li>{t('li4')}</li>
      <li>{t('li5')}</li>
    </ul>
    <p className='my-6 flex items-center justify-center text-2xl text-center font-semibold'>
        {t('paragraph3')}
    </p>
    <div className='flex items-center justify-center'>
    <Link
    href={'mailto:zivic.darko79@gmail.com'} target='blank'
    className="flex items-center gap-5">
      <FiMail className="text-sky-200 w-8 h-8" aria-hidden="true" />
      <div>
        <p className='text-xl'>zivic.darko79@gmail.com</p>
      </div>
    </Link>
    </div>
    <p className='my-10 flex items-center justify-center text-2xl text-center font-semibold'>
       {t('paragraph4')}
    </p>
    <div className='flex items-center justify-center'>
    <div className="flex items-center gap-5">
      <FiPhoneCall className="text-sky-200 w-8 h-8" aria-hidden="true" />
      <div>
        <p className='text-xl'>+ 385 95 507 4922</p>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Complaint;
