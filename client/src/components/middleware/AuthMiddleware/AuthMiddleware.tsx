import { FC, ReactElement } from 'react'

import { UserApi } from '../../../core/redux/user/api'
import { FullScreenLoader } from '../../ui'

interface AuthMiddlewareProps {
  children: ReactElement
}

const AuthMiddleware: FC<AuthMiddlewareProps> = ({ children }) => {
  const { isLoading, isFetching } = UserApi.endpoints.profile.useQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: false,
  })

  const loading = isLoading || isFetching

  if (loading) {
    return <FullScreenLoader />
  }

  return children
}

export default AuthMiddleware
