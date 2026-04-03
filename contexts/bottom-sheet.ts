import { createContext } from 'react'

export interface BottomSheetItem<T extends (props: any) => React.ReactNode> {
  id: string
  comp: T
  props: Parameters<T>[0]
}

export const BottomSheetContext = createContext<{
  open: (list: BottomSheetItem<any>[]) => void
  visible: boolean
  close: () => void
}>(null!)
