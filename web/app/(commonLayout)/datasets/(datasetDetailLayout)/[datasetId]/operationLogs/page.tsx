import React from 'react'
import { getLocaleOnServer, useTranslation as translate } from '@/i18n/server'
import OperationLogs from '@/app/components/datasets/operation-logs'
type Props = {
  params: { datasetId: string }
}
const Settings = async ({
  params: { datasetId },
}: Props) => {
  const locale = getLocaleOnServer()
  const { t } = await translate(locale, 'dataset-operationlog')

  return (
    <div className='bg-white h-full overflow-y-auto'>
      <div className='px-6 py-3'>
        <div className='mb-1 text-lg font-semibold text-gray-900'>{t('title')}</div>
        <div className='text-sm text-gray-500'>{t('desc')}</div>
      </div>
      <OperationLogs datasetId={datasetId}/>
    </div>
  )
}

export default Settings
