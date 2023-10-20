import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { SiteApi } from '../../../../../core/redux/site/api'
import { ANY } from '../../../../../core/types'
import { SiteModel } from '../../../../../core/types/site'

type EditSiteFields = {
  domain: string
}

type EditSiteForm = {
  site: SiteModel
}

const editSiteSchema = object({
  domain: string().nonempty('Поле не может быть пустым'),
})

const EditSiteForm: FC<EditSiteForm> = ({ site }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateApiKey, { isSuccess, isLoading, isError, error }] = SiteApi.useUpdateMutation()

  const methods = useForm<EditSiteFields>({
    mode: 'onChange',
    defaultValues: { domain: site.domain },
    resolver: zodResolver(editSiteSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditSiteFields> = (data) => {
    updateApiKey({ id: site.id, data: { domain: data?.domain } })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Сайт успешно сохранен', { variant: 'success' })
      navigate(BrowseRoutes.admin.site.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="Домен"
          label="Домен"
          name="domain"
          type="text"
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default EditSiteForm
