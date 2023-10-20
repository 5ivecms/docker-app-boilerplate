import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { BrowseRoutes } from '../core/config/routes'
import { UserApi } from '../core/redux/user/api'

const PrivateRoute = () => {
  const location = useLocation()

  const { data, isLoading, isFetching } = UserApi.endpoints.profile.useQuery(null, {
    skip: false,
  })

  const loading = isLoading || isFetching

  if (loading) {
    return <></>
  }

  return data ? <Outlet /> : <Navigate state={{ from: location }} to={BrowseRoutes.auth.login()} replace />
}

export default PrivateRoute
