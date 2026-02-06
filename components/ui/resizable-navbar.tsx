"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      className={cn("sticky inset-x-0 top-4 z-80 w-full pt-4", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(10px)",
        boxShadow: visible
          ? "0 28px 90px rgba(0,0,0,0.55)"
          : "0 18px 60px rgba(0,0,0,0.35)",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: "800px" }}
      className={cn(
        "relative z-60 mx-auto hidden w-full max-w-7xl lg:flex rounded-full",
        // GRADIENT BORDER (wrapper)
        "p-px bg-linear-to-r from-sky-300/45 via-white/12 to-indigo-300/35",
        className
      )}
    >
      {/* INNER PANEL (gradient background) */}
      <div
        className={cn(
          "relative flex w-full items-center justify-between rounded-full px-4 py-2",
          // gradient pozadina (tamnije + aurora)
          "bg-linear-to-r from-slate-950/75 via-[#051542]/55 to-slate-950/75 backdrop-blur-xl",
          // suptilan ring/glow (pojača se kad je visible)
          visible ? "ring-1 ring-sky-300/20" : "ring-1 ring-sky-300/10"
        )}
      >
        {/* PREMIUM SHEEN (vidljiv uvek) */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full",
            "bg-linear-to-r from-white/10 via-white/5 to-white/10",
            "shadow-[0_1px_0_rgba(255,255,255,0.10)_inset]",
            visible ? "opacity-100" : "opacity-70"
          )}
        />

        <div className="relative z-10 flex w-full items-center justify-between">
          {children}
        </div>
      </div>
    </motion.div>
  );
};


export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 items-center justify-center space-x-2 text-sm font-medium lg:flex",
        "pointer-events-none",
        className
      )}
    >
      {items.map((item, idx) => {
        const isActive = pathname === item.link;

        return (
          <Link
            key={`link-${idx}`}
            href={item.link}
            onMouseEnter={() => setHovered(idx)}
            onClick={onItemClick}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "pointer-events-auto",
              "group relative px-4 py-2 transition-colors",
              isActive ? "text-sky-300" : "text-slate-200/80 hover:text-white"
            )}
          >
            {/* Hover pill (ne prikazuj kad je active) */}
            {hovered === idx && !isActive && (
              <motion.div
                layoutId="hovered"
                className="absolute inset-0 rounded-full bg-white/6 border border-white/12 ring-1 ring-sky-300/25 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-white/10 via-white/4 to-white/10"
                />
              </motion.div>
            )}

            {/* Active pill (stalno kad je active) */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-white/8 border border-sky-300/30 ring-1 ring-sky-300/25" />
            )}

            {/* Icon + label */}
            <span className="relative z-20 flex items-center gap-2">
              {item.icon && (
                <span
                  className={cn(
                    "text-[15px] transition hidden lg:inline-flex",
                    isActive
                      ? "text-sky-300"
                      : "text-sky-300/70 group-hover:text-sky-300"
                  )}
                >
                  {item.icon}
                </span>
              )}
              <span>{item.name}</span>
            </span>
          </Link>
        );
      })}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(10px)",
        boxShadow: visible
          ? "0 28px 90px rgba(0,0,0,0.55)"
          : "0 18px 60px rgba(0,0,0,0.35)",
        y: visible ? 12 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 40 }}
      className={cn(
        "relative z-80 mx-auto w-[calc(100%-1rem)] lg:hidden",
        // 👇 GRADIENT BORDER – UVEK TU
        "rounded-2xl p-px bg-linear-to-r from-sky-300/50 via-white/15 to-indigo-300/40",
        className
      )}
    >
      {/* INNER PANEL */}
      <div className="relative rounded-2xl bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 px-4 py-3">
        {/* sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-white/10 via-white/5 to-white/10 shadow-[0_1px_0_rgba(255,255,255,0.10)_inset]"
        />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  // Escape close
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (klik van menija zatvara) */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 cursor-default bg-black/40 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative z-90 mt-3 rounded-[14px] p-px",
              "bg-linear-to-r from-sky-300/50 via-white/15 to-indigo-300/40",
              className
            )}
          >
            <div className="relative rounded-[14px] bg-linear-to-r from-slate-950/85 via-[#051542]/65 to-slate-950/85 backdrop-blur-xl ring-1 ring-sky-300/15 px-4 py-6 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
              {/* sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[14px] bg-linear-to-r from-white/10 via-white/5 to-white/10 shadow-[0_1px_0_rgba(255,255,255,0.10)_inset]"
              />

              <div className="relative z-10 flex flex-col gap-4">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-slate-100/90 hover:text-white" onClick={onClick} />
  ) : (
    <IconMenu2
      className="text-slate-100/90 hover:text-white"
      onClick={onClick}
    />
  );
};

export const NavbarLogo = ({ href = "/" }: { href?: string }) => {
  return (
    <Link
      href={href}
      className="relative z-20 mr-4 flex items-center space-x-2 rounded-full px-2 py-1 text-sm text-slate-100"
    >
      <Image
        src="/logo-transparent.png"
        alt="logo"
        width={30}
        height={30}
        priority
      />
      <span className="font-medium text-slate-100">Hedgehog Web Dev</span>
    </Link>
  );
};

type NavbarButtonSharedProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
};

type NavbarButtonAnchorProps = NavbarButtonSharedProps & {
  href?: string;
  as?: "a";
} & Omit<
  React.ComponentPropsWithoutRef<"a">,
  "as" | "children" | "className" | "href"
>;

type NavbarButtonButtonProps = NavbarButtonSharedProps & {
  as: "button";
  href?: never;
} & Omit<
  React.ComponentPropsWithoutRef<"button">,
  "as" | "children" | "className" | "href"
>;

type NavbarButtonProps = NavbarButtonAnchorProps | NavbarButtonButtonProps;

export const NavbarButton = (props: NavbarButtonProps) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-semibold relative cursor-pointer transition duration-200 inline-block text-center hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40";

  const variantStyles = {
    primary:
      "bg-white/[0.06] text-slate-100 border border-white/12 ring-1 ring-sky-300/20 hover:bg-white/[0.09] shadow-[0_18px_60px_rgba(0,0,0,0.40)]",
    secondary:
      "bg-transparent text-slate-200/90 hover:text-white border border-transparent hover:border-white/12",
    dark: "bg-black/60 text-white border border-white/12 hover:bg-black/70 shadow-[0_18px_60px_rgba(0,0,0,0.50)]",
    gradient:
      "text-white bg-gradient-to-b from-sky-400 to-sky-600 border border-sky-300/40 shadow-[0_18px_60px_rgba(125,211,252,0.25)] hover:from-sky-300 hover:to-sky-600",
  };

  const { children, className, variant = "primary" } = props;
  const content = (
    <>
      {/* premium button sheen */}
      {variant === "primary" && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-md bg-linear-to-r from-white/10 via-white/4 to-white/10"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-md shadow-[0_1px_0_rgba(255,255,255,0.10)_inset]"
          />
        </>
      )}

      <span className="relative z-10">{children}</span>
    </>
  );

  if (props.as === "button") {
    const { as: _as, href: _href, ...buttonProps } = props;
    void _as;
    void _href;

    return (
      <button
        className={cn(baseStyles, variantStyles[variant], className)}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }

  const { as: _as, href, ...anchorProps } = props;
  void _as;
  return (
    <a
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...anchorProps}
    >
      {content}
    </a>
  );
};
