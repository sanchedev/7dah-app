import { BottomSheetContext, BottomSheetItem } from '@/contexts/bottom-sheet'
import { usePreventRemove } from '@react-navigation/native'
import { useContext } from 'react'

export function useBottomSheet() {
  const { open, visible, close } = useContext(BottomSheetContext)
  usePreventRemove(visible, () => {
    close()
  })

  const openSheet = <T extends (props: any) => React.ReactNode>(
    list: BottomSheetItem<T>[],
  ) => {
    open(list)
  }

  const closeSheet = () => {
    close()
  }

  return { openSheet, visible, closeSheet }
}

export function useBottomSheetCloseOnNavigate() {}
