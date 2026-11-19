import type { ReactNode } from "react";
import { cn, Surface } from "@zedtech/zedkit-ui";

/**
 * The Quality / Consistency home-card chrome: inverted primary panel plus a
 * nested glass reply. Welcome popup reuses this so the two surfaces cannot
 * drift. Keep the data attributes: featured CSS keys off them.
 */
export function FeaturedHomeSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Surface
      elevation={0}
      radius="xl"
      padding="card"
      data-home-six-sentences-card="featured"
      data-allow-clip=""
      className={cn("h-full", className)}
    >
      {children}
    </Surface>
  );
}

export function FeaturedHomeReply({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Surface variant="glass" elevation={0} radius="xl" padding="md" data-home-six-sentences-reply="" className={className}>
      {children}
    </Surface>
  );
}
