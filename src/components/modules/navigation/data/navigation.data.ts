/**
 * 鍔熻兘锛氬�鑸�暟鎹�簮
 * 缁撴灉锛氭彁渚涢〉闈㈡暟鎹?
 * 璁捐�鐩�殑锛氭暟鎹�┍鍔║I
 */

export interface NavigationItem {
  id: string
  title: string
  url: string
  description: string
  category: string
  icon?: string
  order?: number
  hidden?: boolean
  disabled?: boolean
  path?: string
  openInNewTab?: boolean
  children?: NavigationItem[]
}
