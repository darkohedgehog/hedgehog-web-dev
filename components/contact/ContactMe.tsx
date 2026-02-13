import Link from "next/link";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { useTranslations } from "next-intl";
import LottieAnimation from "../ui/LottieAnimation";

const ContactMe = () => {
  const t = useTranslations("ContactMe");

  const cardBase =
    "w-full flex-1 h-full min-h-[320px] lg:min-h-[520px] border-2 border-cyan-300/60 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 rounded-2xl";

  return (
    <section className="container relative mx-auto mb-6 lg:mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 lg:min-h-screen lg:py-10">
        {/* Prvi div */}
        <div className={`${cardBase} flex flex-col justify-center p-8`}>
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold sm:text-3xl text-cyan-400 uppercase">
              {t("title1")}
            </h2>

            <p className="mt-4 text-cyan-500 font-semibold text-lg">
              {t("paragraph1")}
            </p>

            <p className="mt-6 text-cyan-400 font-semibold text-2xl">
              {t("title2")}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md space-y-4">
            <Link
              href="mailto:zivic.darko79@gmail.com"
              className="text-cyan-500 hover:text-cyan-100 transition-all duration-300 flex gap-2 items-center justify-start"
            >
              <AiOutlineMail className="w-6 h-6" aria-hidden="true" />
              Email: zivic.darko79@gmail.com
            </Link>

            <Link
              href="tel:+385955074922"
              className="text-cyan-500 hover:text-cyan-100 transition-all duration-300 flex gap-2 items-center justify-start"
            >
              <AiOutlinePhone className="w-6 h-6" aria-hidden="true" />
              {t("title3")} +385 95 507 4922
            </Link>
          </div>
        </div>

        {/* Drugi div */}
        <div className={`${cardBase} flex flex-col items-center justify-center p-8 overflow-hidden`}>
          <h2 className="text-2xl lg:text-3xl font-semibold text-cyan-400 uppercase mb-4 text-center">
            {t("title4")}
          </h2>

          <div className="w-full flex-1 flex items-center justify-center">
            <LottieAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
