import { createContext, useContext } from 'react'

interface ResourceContextValue {
  currentUserId?: string
  onResourceDeleted: (resourceId: string) => void
}

export const ResourceContext = createContext<ResourceContextValue>({
  onResourceDeleted: () => {},
})

export const useResourceContext = () => useContext(ResourceContext)