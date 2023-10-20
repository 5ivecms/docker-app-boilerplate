import { Box } from '@mui/material'
import { FC, ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'

import { Preloader } from '../../ui'
import { style } from './Page.styles'

type PageProps = {
  children: ReactNode
  loading?: boolean
  title?: string
}

const Page: FC<PageProps> = ({ children, title = '', loading = false }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box sx={style}>{loading ? <Preloader /> : children}</Box>
    </>
  )
}

export default Page
