import { User } from '../../types/user'
import { RootState } from '../store'

export const selectCurrentUser = (state: RootState): User | null => state.auth.user
