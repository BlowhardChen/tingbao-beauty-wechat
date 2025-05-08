// 新增预约参数
export interface addReservationParams {
  appointDate: string
  appointTimeId: string
  appointUsername: string
  appointPhone: string
  appointProjectId: string
}

// 预约时间列表
export interface ReservationTimeList {
  id: number
  time: string
  alreadyCount: number
  maxCapacity: number
  userReserved: false
}

// 预约服务列表
export interface ReservationServiceList {
  id: number
  user_id: number
  name: string
  price: number
  time: string
  activity: string
  projectType: string
  durationMinutes: number
  appointDate: string
  appointDatetime: string
  appointPhone: string
  appointStatus: string
  appointUsername: string
  image_url: string
  createTime: string
  updateTime: string
}
