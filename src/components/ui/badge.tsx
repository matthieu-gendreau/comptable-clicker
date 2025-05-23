import * as React from "react"
import { cn } from "@/lib/utils"
import { badgeVariants, type BadgeProps } from "./badge-utils"

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
