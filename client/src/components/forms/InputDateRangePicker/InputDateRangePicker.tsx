/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { CalendarMonth, Close } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  Popover,
  Stack,
  Tooltip,
} from '@mui/material'
import moment from 'moment'
import { FC, useRef, useState } from 'react'
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range'

import { styles } from './InputDateRangePicker.styles'
import { staticRanges } from './static-ranges'
import { DateRange } from './types'
import { getToday } from './utils'

const rdrLocales = require('react-date-range/dist/locale')

type InputDateRangePickerProps = {
  inputProps?: OutlinedInputProps
  value?: DateRange
  onChange?: (data: DateRange) => void
  onApply?: (data: DateRange) => void
  onClose?: () => void
  onClear?: () => void
}

const InputDateRangePicker: FC<InputDateRangePickerProps> = ({
  value,
  inputProps,
  onChange,
  onApply,
  onClose,
  onClear,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | HTMLInputElement | null>(null)
  const [state, setState] = useState<Range[]>(
    value?.startDate && value?.endDate ? [{ ...value, key: 'selection' }] : [{ key: 'selection', ...getToday() }]
  )

  const inputRef = useRef<HTMLInputElement>(null)

  const open = Boolean(anchorEl)
  const popoverId = open ? 'date-range-picker-popover' : undefined
  const inputId = 'date-range-picker-input'

  let inputValue = ''
  if (value?.startDate && value?.endDate) {
    inputValue = `${moment(value?.startDate).format('DD.MM.YYYY')} - ${moment(value?.endDate).format('DD.MM.YYYY')}`
  }

  const handleClickCalendar = () => {
    setAnchorEl(inputRef.current)
  }

  const handleClose = () => {
    setAnchorEl(null)
    if (onClose !== undefined) {
      onClose()
    }
  }

  const handleApply = () => {
    setAnchorEl(null)
    const range = state[0]
    if (range.startDate && range.endDate && onApply !== undefined) {
      onApply({ startDate: range.startDate, endDate: range.endDate })
    }
  }

  const handleChangeDate = (rangesByKey: RangeKeyDict) => {
    const range = Object.values(rangesByKey)[0]
    setState([range])
    if (range.startDate && range.endDate && onChange !== undefined) {
      onChange({ startDate: range.startDate, endDate: range.endDate })
    }
  }

  return (
    <>
      <FormControl variant="outlined">
        {inputProps?.label !== undefined && <InputLabel htmlFor={inputId}>{inputProps.label}</InputLabel>}
        <OutlinedInput
          id={inputId}
          ref={inputRef}
          startAdornment={
            <InputAdornment position="start">
              <IconButton onClick={handleClickCalendar}>
                <CalendarMonth />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            onClear && (
              <Tooltip title="Очистить" placement="right" arrow TransitionProps={{ timeout: 100 }}>
                <InputAdornment position="end">
                  <IconButton onClick={onClear} disabled={!value?.startDate && !value?.endDate}>
                    <Close />
                  </IconButton>
                </InputAdornment>
              </Tooltip>
            )
          }
          value={inputValue}
          size="small"
          placeholder="DD.MM.YYYY - DD.MM.YYYY"
          {...inputProps}
        />
      </FormControl>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={styles.popover}
      >
        <DateRangePicker
          locale={rdrLocales.ru}
          onChange={handleChangeDate}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
          inputRanges={[]}
          staticRanges={staticRanges}
        />
        <Box sx={styles.footer}>
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button size="small" variant="outlined" onClick={handleClose}>
              Закрыть
            </Button>
            <Button size="small" variant="contained" onClick={handleApply}>
              Применить
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}

export default InputDateRangePicker
