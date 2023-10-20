import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { XApiKeyApi } from '../../../../../core/redux/x-api-key/api'
import { ANY } from '../../../../../core/types'
import { XApiKeyModel } from '../../../../../core/types/x-api-key'

type EditApiKeyFields = {
  comment: string
}

type EditApiKeyFormProps = {
  apiKey: XApiKeyModel
}

const editApiKeySchema = object({
  comment: string().nonempty('Поле не может быть пустым'),
})

const EditApiKeyForm: FC<EditApiKeyFormProps> = ({ apiKey }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateApiKey, { isSuccess, isLoading, isError, error }] = XApiKeyApi.useUpdateMutation()

  const methods = useForm<EditApiKeyFields>({
    defaultValues: { comment: apiKey.comment },
    mode: 'onChange',
    resolver: zodResolver(editApiKeySchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditApiKeyFields> = (data) => {
    updateApiKey({ id: apiKey.id, comment: data.comment })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Api key успешно сохранен', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.xApiKey.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="Комментарий"
          label="Комментарий"
          name="comment"
          type="text"
          rows={5}
          multiline
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default EditApiKeyForm
