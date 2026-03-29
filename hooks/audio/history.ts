import { History } from '@/lib/audio/history'
import { useSignalState } from '../signal'

export function useHistory() {
  const [history] = useSignalState(History.historyChanged, History.get())

  return history
}
