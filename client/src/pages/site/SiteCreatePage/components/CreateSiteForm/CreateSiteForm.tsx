import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { SiteApi } from '../../../../../core/redux/site/api'
import { ANY } from '../../../../../core/types'

type CreateSiteFields = {
  domain: string
}

const createSiteSchema = object({
  domain: string().nonempty('Поле не может бысть пустым'),
})

const CreateSiteForm = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createSite, { isLoading, isError, error, isSuccess }] = SiteApi.useCreateMutation()
  const methods = useForm<CreateSiteFields>({ mode: 'onChange', resolver: zodResolver(createSiteSchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateSiteFields> = (data) => {
    createSite(data)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Сайт добавлен', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.site.index())
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
          autoFocus
          variant="outlined"
          placeholder="Сайт"
          label="Сайт"
          name="domain"
          type="text"
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default CreateSiteForm
