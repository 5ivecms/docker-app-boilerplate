import { Add } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'
import type { FC } from 'react'
import { Link } from 'react-router-dom'

export interface AddButtonProps extends ButtonProps {
  text: string
  to: string
}

const AddButton: FC<AddButtonProps> = ({ text, to, ...rest }) => (
  <Button component={Link} endIcon={<Add />} to={to} variant="contained" {...rest}>
    {text}
  </Button>
)

export default AddButton
