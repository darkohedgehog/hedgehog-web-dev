import Complaint from '@/components/complaint/Complaint';
import { getTranslations } from 'next-intl/server';

const ComplaintPage = async () => {
  const t = await getTranslations('Complaint');

  return (
    <>
      <h1 className='sr-only'>{t('title')}</h1>
      <Complaint  />
    </>
  )
}

export default ComplaintPage;
