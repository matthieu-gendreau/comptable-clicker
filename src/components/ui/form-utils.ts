import * as React from "react"
import { useFormField } from "./form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export const formItemClasses = "space-y-2"
export const formLabelClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
export const formControlClasses = "mt-2"
export const formDescriptionClasses = "text-sm text-muted-foreground"
export const formMessageClasses = "text-sm font-medium text-destructive"
export const formFieldContextClasses = ""

export interface FormFieldContextValue<
  TFieldValues extends Record<string, unknown> = Record<string, unknown>
> {
  name: string
}

export interface FormItemContextValue {
  id: string
}

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>

export type FormLabelProps = React.ComponentPropsWithoutRef<typeof Label>

export type FormControlProps = React.ComponentPropsWithoutRef<"div">

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement> 