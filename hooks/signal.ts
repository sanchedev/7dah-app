import { Signal } from '@/lib/signal'
import { useEffect, useState } from 'react'

export function useSignalState<T extends any[]>(
  signal: Signal<T>,
  ...defaultValues: T
) {
  const [state, setState] = useState(defaultValues)

  useEffect(() => {
    const handleSet = (...args: T) => setState(args)

    signal.on(handleSet)

    return () => {
      signal.off(handleSet)
    }
  }, [signal])

  return state
}
