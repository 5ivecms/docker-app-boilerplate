/* eslint-disable react/require-default-props */
import { ArrowBackIosNewOutlined } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { backIconSx, pageHeaderContainer, pageHeaderLeftSx } from './style.sx'

type PageHeaderProps = {
  showBackButton?: boolean
  title: string
  buttons?: ReactNode[]
}

const PageHeader: FC<PageHeaderProps> = ({ title, buttons = [], showBackButton = false }) => {
  const navigate = useNavigate()

  const goBack = (): void => {
    navigate(-1)
  }

  return (
    <Box sx={pageHeaderContainer}>
      <Box sx={pageHeaderLeftSx}>
        {showBackButton && (
          <IconButton aria-label="back" color="info" onClick={goBack} size="medium" sx={backIconSx}>
            <ArrowBackIosNewOutlined />
          </IconButton>
        )}
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      </Box>
      {buttons.length > 0 && (
        <Stack direction="row" spacing={1}>
          {buttons.map((button) => button)}
        </Stack>
      )}
    </Box>
  )
}

export default PageHeader
