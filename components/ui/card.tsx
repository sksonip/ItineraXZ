import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl
        border
        border-[#292929]
        bg-[#151515]
        text-white
        shadow-sm
        ${className}
      `}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        flex
        flex-col
        space-y-1.5
        border-b
        border-[#292929]
        p-4
        ${className}
      `}
      {...props}
    />
  );
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`
        text-sm
        font-black
        tracking-tight
        text-white
        ${className}
      `}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`
        text-[9px]
        leading-5
        text-zinc-600
        ${className}
      `}
      {...props}
    />
  );
}

export function CardContent({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        p-4
        ${className}
      `}
      {...props}
    />
  );
}

export function CardFooter({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        flex
        items-center
        border-t
        border-[#292929]
        p-4
        ${className}
      `}
      {...props}
    />
  );
}