'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import useSWR from 'swr'
import { Pagination } from 'react-headless-pagination'
import { omit } from 'lodash-es'
import dayjs from 'dayjs'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import List from './list'
import Filter from './filter'
import s from './style.module.css'
import Loading from '@/app/components/base/loading'
import { APP_PAGE_LIMIT } from '@/config'
import { getDatasetOperationLogs } from '@/service/datasets'

export type QueryParam = {
  period?: number | string
  created_by?: string
  keyword?: string
  start?: string
  end?: string
}

const Logs: FC <{ datasetId: string }> = ({ datasetId }) => {
  const { t } = useTranslation()
  const [queryParams, setQueryParams] = useState<QueryParam>({ period: 7, created_by: 'all' })
  const [currPage, setCurrPage] = React.useState<number>(0)

  const query = {
    page: currPage + 1,
    limit: APP_PAGE_LIMIT,
    ...(queryParams.period !== 'all'
      ? {
        start: dayjs().subtract(queryParams.period as number, 'day').startOf('day').format('YYYY-MM-DD HH:mm'),
        end: dayjs().format('YYYY-MM-DD HH:mm'),
      }
      : {}),
    ...omit(queryParams, ['period']),
  }
  const { data: logsRes, error, mutate: logsMutate } = useSWR({
    action: 'fetchTestingRecords',
    datasetId,
    params: query,
  }, apiParams => getDatasetOperationLogs(omit(apiParams, 'action')))

  const total = logsRes?.total

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-col px-6 py-4 flex-1'>
        <Filter queryParams={queryParams} setQueryParams={setQueryParams} />
        {total === undefined
          ? <Loading type='app' />
          : <List logs={logsRes} onRefresh={logsMutate} />
        }
        {/* Show Pagination only if the total is more than the limit */}
        {(total && total > APP_PAGE_LIMIT)
          ? <Pagination
            className="flex items-center w-full h-10 text-sm select-none mt-8"
            currentPage={currPage}
            edgePageCount={2}
            middlePagesSiblingCount={1}
            setCurrentPage={setCurrPage}
            totalPages={Math.ceil(total / APP_PAGE_LIMIT)}
            truncableClassName="w-8 px-0.5 text-center"
            truncableText="..."
          >
            <Pagination.PrevButton
              disabled={currPage === 0}
              className={`flex items-center mr-2 text-gray-500  focus:outline-none ${currPage === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-200'}`} >
              <ArrowLeftIcon className="mr-3 h-3 w-3" />
              {t('appLog.table.pagination.previous')}
            </Pagination.PrevButton>
            <div className={`flex items-center justify-center flex-grow ${s.pagination}`}>
              <Pagination.PageButton
                activeClassName="bg-primary-50 dark:bg-opacity-0 text-primary-600 dark:text-white"
                className="flex items-center justify-center h-8 w-8 rounded-full cursor-pointer"
                inactiveClassName="text-gray-500"
              />
            </div>
            <Pagination.NextButton
              disabled={currPage === Math.ceil(total / APP_PAGE_LIMIT) - 1}
              className={`flex items-center mr-2 text-gray-500 focus:outline-none ${currPage === Math.ceil(total / APP_PAGE_LIMIT) - 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-200'}`} >
              {t('appLog.table.pagination.next')}
              <ArrowRightIcon className="ml-3 h-3 w-3" />
            </Pagination.NextButton>
          </Pagination>
          : null}
      </div>
    </div>
  )
}

export default Logs
