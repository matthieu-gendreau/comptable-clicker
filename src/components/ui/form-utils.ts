import * as React from "react"
import { useFormContext } from "react-hook-form"
import type { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

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

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
} 