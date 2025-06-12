import type { LazyExoticComponent } from 'react'

export interface EmailStructure {
  email: string
}

export interface LoginDataType extends EmailStructure {
  password: string
}
export interface RegisterDataType extends LoginDataType {
  firstName: string
  lastName: string
}

export interface NewPasswordDataType {
  password: string
  confirmPassword: string
}
export interface VerificationDataType {
  email: string
  otp: string
}
export interface ResendVerificationDataType {
  email: string
}

export interface UserDataType {
  firstName?: string
  lastName?: string
  password?: string
  email?: string
}

export interface InstructorType {
  img?: string
  name?: string
  description?: string[]
  icons?: JSX.Element[]
}

export interface RouteType {
  path: string
  component: LazyExoticComponent<() => JSX.Element>
  children?: RouteType[]
  protection?: string
}
