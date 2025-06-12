/* eslint-disable no-useless-escape */
// const isEmptyObject = (objectName: any) => {
//   for (const prop in objectName) {
//     const t = objectName
//     if (t.hasOwnProperty(prop) && objectName[prop as keyof typeof objectName].length > 0) {
//       return true
//     }
//   }
//   return false
// }

import { LoginDataType, RegisterDataType } from '../../types'

const errors = {} as LoginDataType
const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

export const validateLogin = (values: LoginDataType) => {
  if (!values.email) {
    errors.email = 'Email is required'
  } else if (!regex.test(values.email)) {
    errors.email = 'This is not a valid email address'
  }
  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Pasword must have atleast 8 characters'
  } else if (values.password.length > 16) {
    errors.password = 'Pasword can not be greater than 16 characters'
  }
  return { errors }
}

export const validateRegister = (values: RegisterDataType) => {
  const errors = {} as RegisterDataType
  if (!values.email) {
    errors.email = 'Email is required'
  } else if (!regex.test(values.email)) {
    errors.email = 'This is not a valid email address'
  }
  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Pasword must have atleast 8 characters'
  } else if (values.password.length > 16) {
    errors.password = 'Pasword can not be greater than 16 characters'
  }
  if (!values?.firstName) {
    errors.firstName = 'First Name is required'
  }
  if (!values?.lastName) {
    errors.lastName = 'Last Name is required'
  }

  return { errors }
}

export const validateEmail = (email: string) => {
  if (!regex.test(email)) {
    return false
  } else {
    return true
  }
}
