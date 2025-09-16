import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((list) => list.filter(t => t.id !== id))
  }, [])

  const show = useCallback((message, type = 'success', timeoutMs = 2500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => [...list, { id, message, type }])
    if (timeoutMs > 0) setTimeout(() => remove(id), timeoutMs)
  }, [remove])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow card ${t.type === 'error' ? 'border-red-300 bg-red-50 text-red-800' : 'border-green-300 bg-green-50 text-green-800'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


