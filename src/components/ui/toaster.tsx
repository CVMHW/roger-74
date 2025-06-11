
import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Defensive hook usage with error handling
  let toasts = { toasts: [] };
  
  try {
    const toastHook = useToast();
    toasts = toastHook;
  } catch (error) {
    console.warn('Toast system failed to initialize:', error);
    // Return early with empty component if toast system fails
    return null;
  }

  return (
    <ToastProvider>
      {toasts.toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
