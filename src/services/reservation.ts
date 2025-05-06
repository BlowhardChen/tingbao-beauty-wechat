import type { addReservationParams } from '@/types/reservation'
import { http } from '@/utils/request'

// 新增预约
export const addReservation = (data: addReservationParams) =>
  http({
    url: '/wxapp/appAppointReservation/add',
    method: 'POST',
    data,
  })

// 取消预约
export const cancelReservation = (id: number) =>
  http({
    url: '/wxapp/appAppointReservation/cancelAppoint',
    method: 'POST',
    data: { id },
  })

// 预约确认完成
export const confirmReservation = (id: number) =>
  http<any>({
    url: '/wxapp/appAppointReservation/confirmAppoint',
    method: 'POST',
    data: { id },
  })

// 获取预约列表
export const getReservationList = (data: { appointStatus: string; userId: number }) =>
  http<any>({
    url: '/wxapp/appAppointReservation/list',
    method: 'POST',
    data,
  })

// 获取预约时间段
export const getReservationTime = (localDate: string) =>
  http<any>({
    url: '/wxapp/appAppointTimePoint/list',
    method: 'GET',
    data: { localDate },
  })
