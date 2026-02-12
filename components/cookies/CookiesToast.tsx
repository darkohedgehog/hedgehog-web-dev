'use client';

import { useMemo, useState } from 'react';
import { LuCookie } from 'react-icons/lu';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CookiesToast() {
  const t = useTranslations('CookieConsent');
  const pathname = usePathname();

  const currentLocale = useMemo(() => {
    const seg = pathname.split('/')[1];
    return seg || 'hr';
  }, [pathname]);

  const [showModal, setShowModal] = useState(false);

  const handleAgree = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted');
    } catch {}
    setShowModal(false);
  };

  const handleDisagree = () => {
    try {
      localStorage.setItem('cookieConsent', 'declined');
    } catch {}
    setShowModal(false);
  };

  return (
    <div>
      {/* Dugme za kolačiće — uvek vidljivo */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 left-4 p-3 bg-blue-700 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors z-50"
        aria-label="Cookie settings"
        type="button"
        title="Cookie preferences"
      >
        <LuCookie className="text-xl" />
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 mx-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-zinc-500 rounded-xl shadow-lg shadow-accentDark p-6 relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-neutral-600 hover:text-neutral-300"
              aria-label="Close modal"
              type="button"
            >
              <AiOutlineClose className="text-xl" />
            </button>

            <h2 className="text-xl text-neutral-100 font-semibold mb-4">
              {/* text1 je intro rečenica */}
              {t('text1')}
            </h2>

            <p className="text-neutral-300 mb-5">
              {/* text2 = "uvjetima korištenja" */}
              <Link
                href={`/${currentLocale}/privacy`}
                className="text-blue-700 hover:underline"
                onClick={() => setShowModal(false)}
              >
                {t('text2')} {' '}  {t('text3')}
              </Link> 
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleDisagree}
                className="px-4 py-2 bg-red-600 text-neutral-200 rounded-2xl hover:bg-red-500 transition-colors"
                type="button"
              >
                {t('text5')}
              </button>

              <button
                onClick={handleAgree}
                className="px-4 py-2 bg-blue-700 text-white rounded-2xl hover:bg-blue-600 transition-colors"
                type="button"
              >
                {t('text4')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
