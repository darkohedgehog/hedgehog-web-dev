"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [animate, isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `text-white opacity-0 hidden`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-1 h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const textClass =
    "pb-2 text-lg sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold whitespace-nowrap";

  const renderWords = () => {
    return (
      <span className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <span key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`text-sky-200 `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "my-6 min-h-7 sm:min-h-8 md:min-h-9 xl:min-h-12",
        className
      )}
    >
      <div className="relative inline-block align-top">
        {/* Reserve final width from first paint to prevent CLS */}
        <div aria-hidden className={cn("invisible", textClass)}>
          {renderWords()}
        </div>

        <motion.div
          className="absolute inset-0 overflow-hidden pb-2"
          initial={{
            width: "0%",
          }}
          whileInView={{
            width: "100%",
          }}
          transition={{
            duration: 2,
            ease: "linear",
            delay: 1,
          }}
        >
          <div className={textClass}>
            {renderWords()}
          </div>
        </motion.div>

        <motion.span
  initial={{
    left: 0,
    opacity: 0,
  }}
  whileInView={{
    left: "100%",
  }}
  animate={{
    opacity: 1,
  }}
  transition={{
    left: { duration: 2, ease: "linear", delay: 1 },
    opacity: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
    },
  }}
  className={cn(
    "pointer-events-none absolute top-0 rounded-sm w-1 h-4 sm:h-6 xl:h-12 bg-sky-500",
    cursorClassName
  )}
/>
      </div>

      <span
        aria-hidden
        className="invisible inline-block rounded-sm w-1 h-4 sm:h-6 xl:h-12 align-top"
      ></span>
    </div>
  );
};
