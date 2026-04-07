import { createContext, useContext } from 'react'

export const AppStoreContext = createContext(null)

export function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider')
  }
  return context
}
