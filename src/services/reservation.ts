import type {
  addReservationParams,
  ReservationServiceList,
  ReservationTimeList,
} from '@/types/reservation'
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
  http({
    url: '/wxapp/appAppointReservation/confirmAppoint',
    method: 'POST',
    data: { id },
  })

/**
 * 获取预约列表
 * @param data 请求参数
 * @param data.appointStatus 预约状态：不传查全部，待使用pending, 已使用used, 取消canceled
 * @param data.userId 用户ID
 * @param data.pageNum 分页大小，默认10
 */
export const getReservationList = (data: {
  appointStatus?: 'pending' | 'used' | 'canceled' | string
  userId?: number
  pageNum: number
  pageSize: number
}) =>
  http<ReservationServiceList[]>({
    url: '/wxapp/appAppointReservation/list',
    method: 'POST',
    data,
  })

/**
 * 获取预约时间
 * @param localDate 格式必须是 YYYY-MM-DD 例如：2025-05-08
 */
export const getReservationTime = (localDate?: string) =>
  http<ReservationTimeList[]>({
    url: `/wxapp/appAppointTimePoint/list`,
    method: 'GET',
    data: { localDate },
  })
