import classNames from "classnames";
import { Fragment } from "react";

export default function Section({
  children,
  hero,
  prose,
  title,
  className,
}: {
  children: React.ReactNode;
  hero?: boolean;
  prose?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <Fragment>
      <div
        className={classNames(
          "px-6 lg:px-8 relative z-10",
          {
            "w-full": !prose && !hero,
            "w-full max-w-3xl mx-auto": prose || hero,
            "mt-16 pt-20 pb-16 md:pt-28 md:pb-24 text-center max-w-3xl flex flex-col justify-center items-center [&>p]:my-0 [&>p]:text-2xl [&>p]:text-text/80":
              hero,
          },
          className
        )}
      >
        {title ? (
          <div className="uppercase mb-4 text-base text-primary font-bold tracking-wider rounded-full px-4 py-2">
            {title}
          </div>
        ) : null}
        {children}
      </div>
    </Fragment>
  );
}
