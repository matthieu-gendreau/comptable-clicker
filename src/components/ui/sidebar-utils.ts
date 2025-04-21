import { type VariantProps, cva } from "class-variance-authority"

export const sidebarVariants = cva(
  "fixed inset-y-0 z-50 flex h-full flex-col",
  {
    variants: {
      position: {
        left: "left-0",
        right: "right-0",
      },
      size: {
        sm: "w-1/4",
        default: "w-1/3",
        lg: "w-1/2",
      },
    },
    defaultVariants: {
      position: "left",
      size: "default",
    },
  }
)

export type SidebarProps = VariantProps<typeof sidebarVariants>

export const sidebarClasses = {
  overlay: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  content: "h-full border-r bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=closed]:duration-300 data-[state=open]:duration-500",
  header: "space-y-2 border-b pb-4",
  title: "text-lg font-semibold tracking-tight",
  description: "text-sm text-muted-foreground",
  footer: "border-t pt-4",
} 