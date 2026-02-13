"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { Switch } from "../ui/switch";
import { PiGlobeHemisphereWestThin } from "react-icons/pi";

// next-intl wrappers
import { usePathname, useRouter } from "@/i18n/navigation";

const LangSwitch = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const checked = locale === "en";

  const onCheckedChange = (nextChecked: boolean) => {
    const newLocale = nextChecked ? "en" : "hr";

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center justify-center space-x-3 mr-4">
      <Switch
        id="language-mode"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={isPending}
        aria-hidden="true"
      />
      <PiGlobeHemisphereWestThin className="text-cyan-400 w-6 h-6" />
    </div>
  );
};

export default LangSwitch;