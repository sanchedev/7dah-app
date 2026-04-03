import { BottomSheet } from '@/components/ui/bottom-sheet'
import { BottomSheetContext, BottomSheetItem } from '@/contexts/bottom-sheet'
import { useState } from 'react'

export function BottomSheetProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [list, setList] = useState<
    BottomSheetItem<(props: any) => React.ReactNode>[] | null
  >(null)

  const visible = list != null

  return (
    <BottomSheetContext.Provider
      value={{
        open: (newList) => setList(newList),
        visible,
        close: () => setList(null),
      }}>
      {children}
      <BottomSheet visible={visible} onClose={() => setList(null)}>
        {list?.map((item) => {
          const Comp = item.comp
          return <Comp key={item.id} {...item.props} />
        })}
      </BottomSheet>
    </BottomSheetContext.Provider>
  )
}
