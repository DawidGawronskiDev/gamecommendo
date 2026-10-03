import { cn } from "@/lib/utils";

type DesignSpecimenProps = React.ComponentProps<"div"> & {
  name: string;
  note?: string;
};

export function DesignSpecimen({
  name,
  note,
  className,
  children,
  ...props
}: DesignSpecimenProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.625rem] leading-none font-semibold tracking-widest uppercase">
        {name}
        {note && (
          <span className="font-heading tracking-normal text-muted-foreground normal-case">
            {note}
          </span>
        )}
      </h3>
      {children}
    </div>
  );
}
