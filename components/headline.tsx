import classNames from "classnames";

export default function Headline({
  children,
  className,
  level,
  as,
}: {
  children: React.ReactNode;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  level: "1" | "2" | "3" | "4" | "5" | "6";
  className?: string | null;
}) {
  const props = {
    className: classNames(
      "block text-text mb-6 font-bold tracking-tight",
      {
        "md:text-4xl sm:text-2xl": level === "1",
        "md:text-3xl sm:text-xl": level === "2",
        "md:text-2xl sm:text-lg": level === "3",
        "md:text-xl sm:text-base": level === "4",
        "md:text-lg sm:text-sm": level === "5",
        "md:text-base sm:text-xs": level === "6",
      },
      className
    ),
  };
  switch (as) {
    case "h1":
      return <h1 {...props}>{children}</h1>;
    case "h2":
      return <h2 {...props}>{children}</h2>;
    case "h3":
      return <h3 {...props}>{children}</h3>;
    case "h4":
      return <h4 {...props}>{children}</h4>;
    case "h5":
      return <h5 {...props}>{children}</h5>;
    case "h6":
      return <h6 {...props}>{children}</h6>;
  }
}
