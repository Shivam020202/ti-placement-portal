import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[1000] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const Toast = {
  success: (message) => {
    const toastId = Math.random().toString(36).substr(2, 9)
    const toastEl = document.createElement('div')
    toastEl.id = toastId
    toastEl.className = cn(
      'fixed top-4 left-1/2 -translate-x-1/2 z-[99999] rounded-lg p-4 text-white shadow-xl', // Increased z-index
      'bg-green-500 backdrop-blur-sm border border-white/10',
      'flex items-center gap-3 min-w-[320px] max-w-[420px]',
      'animate-toastSlideDown'
    )
    
    const icon = document.createElement('span')
    icon.className = 'flex-shrink-0'
    icon.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg>'
    
    const text = document.createElement('span')
    text.className = 'text-sm font-medium'
    text.textContent = message
    
    toastEl.appendChild(icon)
    toastEl.appendChild(text)

    document.body.appendChild(toastEl)
    setTimeout(() => {
      toastEl.classList.add('animate-toastSlideUp')
      setTimeout(() => document.body.removeChild(toastEl), 300)
    }, 3000)
  },

  error: (message) => {
    const toastId = Math.random().toString(36).substr(2, 9)
    const toastEl = document.createElement('div')
    toastEl.id = toastId
    toastEl.className = cn(
      'fixed top-4 left-1/2 -translate-x-1/2 z-[99999] rounded-lg p-4 text-white shadow-xl', // Increased z-index
      'bg-red backdrop-blur-sm border border-white/10',
      'flex items-center gap-3 min-w-[320px] max-w-[420px]',
      'animate-toastSlideDown'
    )
    
    const icon = document.createElement('span')
    icon.className = 'flex-shrink-0'
    icon.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>'
    
    const text = document.createElement('span')
    text.className = 'text-sm font-medium'
    text.textContent = message
    
    toastEl.appendChild(icon)
    toastEl.appendChild(text)

    document.body.appendChild(toastEl)
    setTimeout(() => {
      toastEl.classList.add('animate-toastSlideUp')
      setTimeout(() => document.body.removeChild(toastEl), 300)
    }, 3000)
  },

  info: (message) => {
    const toastId = Math.random().toString(36).substr(2, 9)
    const toastEl = document.createElement('div')
    toastEl.id = toastId
    toastEl.className = cn(
      'fixed top-4 left-1/2 -translate-x-1/2 z-[99999] rounded-lg p-4 text-white shadow-xl', // Increased z-index
      'bg-gray-900 backdrop-blur-sm border border-white/10',
      'flex items-center gap-3 min-w-[320px] max-w-[420px]',
      'animate-toastSlideDown'
    )
    
    const icon = document.createElement('span')
    icon.className = 'flex-shrink-0'
    icon.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>'
    
    const text = document.createElement('span')
    text.className = 'text-sm font-medium'
    text.textContent = message
    
    toastEl.appendChild(icon)
    toastEl.appendChild(text)

    document.body.appendChild(toastEl)
    setTimeout(() => {
      toastEl.classList.add('animate-toastSlideUp')
      setTimeout(() => document.body.removeChild(toastEl), 300)
    }, 3000)
  }
}

export { Toast, ToastProvider, ToastViewport }