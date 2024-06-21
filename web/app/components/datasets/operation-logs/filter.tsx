'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import useSWR from 'swr'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import type { QueryParam } from './index'
import { SimpleSelect } from '@/app/components/base/select'
import { fetchMembers } from '@/service/common'
dayjs.extend(quarterOfYear)

const today = dayjs()

export const TIME_PERIOD_LIST = [
  { value: 7, name: 'last7days' },
  { value: today.diff(today.subtract(1, 'month'), 'day'), name: 'last1months' },
  { value: today.diff(today.subtract(3, 'month'), 'day'), name: 'last3months' },
  {
    value: today.diff(today.subtract(12, 'month'), 'day'),
    name: 'lastyear',
  },
  {
    value: today.diff(today.subtract(36, 'month'), 'day'),
    name: 'last3years',
  },
  { value: 'all', name: 'allTime' },
]

type IFilterProps = {
  queryParams: QueryParam
  setQueryParams: (v: QueryParam) => void
}

const Filter: FC<IFilterProps> = ({
  queryParams,
  setQueryParams,
}: IFilterProps) => {
  const { data } = useSWR(
    { url: '/workspaces/current/members' },
    fetchMembers,
  )
  const { t } = useTranslation()
  return (
    <div className='flex flex-row flex-wrap gap-y-2 gap-x-4 items-center mb-4 text-gray-900 text-base'>
      <SimpleSelect
        items={TIME_PERIOD_LIST.map(item => ({
          value: item.value,
          name: t(`datasetOperationLogs.filters.${item.name}`),
        }))}
        className='mt-0 !w-40'
        onSelect={(item) => {
          setQueryParams({ ...queryParams, period: item.value })
        }}
        defaultValue={queryParams.period}
      />
      <div className='relative rounded-md'>
        <SimpleSelect
          defaultValue={'all'}
          className='!w-[300px]'
          onSelect={(item) => {
            setQueryParams({
              ...queryParams,
              created_by: item.value as string,
            })
          }}
          items={[
            { value: 'all', name: t('appLog.filter.annotation.all') },
          ].concat(data?.accounts
            ? data.accounts.filter(u => ['admin', 'owner'].includes(u.role)).map(user => ({ value: user.id, name: user.name }))
            : [])}
        />
      </div>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <MagnifyingGlassIcon
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </div>
        <input
          type='text'
          name='query'
          className='block w-[240px] bg-gray-100 shadow-sm rounded-md border-0 py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-200 focus-visible:outline-none sm:text-sm sm:leading-6'
          placeholder={t('common.operation.search')!}
          value={queryParams.keyword}
          onChange={(e) => {
            setQueryParams({ ...queryParams, keyword: e.target.value })
          }}
        />
      </div>
    </div>
  )
}

export default Filter
