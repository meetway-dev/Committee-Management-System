import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListRowProps {
  leading?: React.ReactNode;
  title: string;
  caption?: React.ReactNode;
  value?: string;
  valueCaption?: string;
  trailing?: React.ReactNode;
  href?: string;
  chevron?: boolean;
  className?: string;
}

function RowBody({
  leading,
  title,
  caption,
  value,
  valueCaption,
  trailing,
  chevron,
}: Omit<ListRowProps, "href" | "className">) {
  return (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8rem] font-semibold leading-tight">
          {title}
        </p>
        {caption && (
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {caption}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {(value || valueCaption) && (
          <div className="text-right">
            {value && (
              <p className="text-[0.8rem] font-bold leading-tight tabular">
                {value}
              </p>
            )}
            {valueCaption && (
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {valueCaption}
              </p>
            )}
          </div>
        )}
        {trailing}
        {chevron && (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
        )}
      </div>
    </>
  );
}

/**
 * The universal compact list item — replaces desktop table rows everywhere.
 * Renders as a link when `href` is given.
 */
export function ListRow({ href, className, ...props }: ListRowProps) {
  const base = cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
    href && "hover:bg-muted/60 active:bg-muted",
    className
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        <RowBody {...props} />
      </Link>
    );
  }

  return (
    <div className={base}>
      <RowBody {...props} />
    </div>
  );
}

/** Wraps rows with hairline dividers. */
export function ListGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border/60", className)}>{children}</div>
  );
}
