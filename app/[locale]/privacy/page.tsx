import CookiesStatement from '@/components/privacy/CookiesStatement';
import Privacy from '@/components/privacy/Privacy';
import TermsOfUse from '@/components/privacy/TermsOfUse';
import { getTranslations } from 'next-intl/server';

const PrivacyPage = async () => {
  const t = await getTranslations('Privacy');

  return (
    <>
      <h1 className='sr-only'>{t('title1')}</h1>
      <Privacy  />
      <CookiesStatement  />
      <TermsOfUse   />
    </>
  )
}

export default PrivacyPage;
