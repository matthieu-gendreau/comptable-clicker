import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { sidebarVariants, type SidebarProps, sidebarClasses } from "./sidebar-utils"

const Sidebar = SheetPrimitive.Root

const SidebarTrigger = SheetPrimitive.Trigger

const SidebarClose = SheetPrimitive.Close

const SidebarPortal = SheetPrimitive.Portal

const SidebarOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(sidebarClasses.overlay, className)}
    {...props}
    ref={ref}
  />
))
SidebarOverlay.displayName = SheetPrimitive.Overlay.displayName

interface SidebarContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    SidebarProps {}

const SidebarContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SidebarContentProps
>(({ position, size, className, children, ...props }, ref) => (
  <SidebarPortal>
    <SidebarOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        sidebarVariants({ position, size }),
        sidebarClasses.content,
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SidebarPortal>
))
SidebarContent.displayName = SheetPrimitive.Content.displayName

const SidebarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(sidebarClasses.header, className)} {...props} />
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(sidebarClasses.footer, className)} {...props} />
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(sidebarClasses.title, className)}
    {...props}
  />
))
SidebarTitle.displayName = SheetPrimitive.Title.displayName

const SidebarDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(sidebarClasses.description, className)}
    {...props}
  />
))
SidebarDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sidebar,
  SidebarTrigger,
  SidebarClose,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTitle,
  SidebarDescription,
}
