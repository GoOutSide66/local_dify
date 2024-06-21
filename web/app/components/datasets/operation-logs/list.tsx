'use client'
import type { FC } from 'react'
import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useTranslation } from 'react-i18next'
import s from './style.module.css'
import type { DataSetOperationsLogsResponse } from '@/models/datasets'
import Loading from '@/app/components/base/loading'
import useTimestamp from '@/hooks/use-timestamp'

dayjs.extend(utc)
dayjs.extend(timezone)

type IConversationList = {
  logs?: DataSetOperationsLogsResponse
  onRefresh: () => void
}

const ConversationList: FC<IConversationList> = ({ logs, onRefresh }) => {
  const { t } = useTranslation()
  const { formatTime } = useTimestamp()
  if (!logs)
    return <Loading />

  return (
    <div className='overflow-x-auto'>
      <table className={`w-full min-w-[440px] border-collapse border-0 text-sm mt-3 ${s.logTable}`}>
        <thead className="h-8 leading-8 border-b border-gray-200 text-gray-500 font-bold">
          <tr>
            <td className='whitespace-nowrap'>{t('datasetOperationLogs.createdTime')}</td>
            <td className='whitespace-nowrap'>{t('datasetOperationLogs.createdName')}</td>
            <td className='whitespace-nowrap'>{t('datasetOperationLogs.objective')}</td>
            <td className='whitespace-nowrap'>{t('datasetOperationLogs.optType')}</td>
            <td className='whitespace-nowrap'>{t('datasetOperationLogs.note')}</td>
          </tr>
        </thead>
        <tbody className="text-gray-500">
          {logs.data.map((log: any) => {
            return <tr
              key={log.id}
              className={'border-b border-gray-200 h-8 hover:bg-gray-50 cursor-pointer'}
              onClick={() => {}}>
              <td className='w-[160px]'>{formatTime(log.created_at, t('appLog.dateTimeFormat') as string)}</td>
              <td>{log.created_name}</td>
              <td>{log.objective}</td>
              <td>{log.opt_type}</td>
              <td>{log.note}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ConversationList
