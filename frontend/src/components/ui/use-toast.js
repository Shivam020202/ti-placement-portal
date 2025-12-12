import { useEffect, useState } from "react"

const TOAST_TIMEOUT = 5000

export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => {
          return toast.timestamp + TOAST_TIMEOUT > Date.now()
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const addToast = (message) => {
    const newToast = {
      id: Date.now(),
      message,
      timestamp: Date.now(),
    }
    setToasts((prevToasts) => [...prevToasts, newToast])
  }

  return { toasts, addToast }
}