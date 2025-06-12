import type { Middleware } from 'redux'

const logger: Middleware = store => next => action => {
  const returnValue = next(action)
  console.group(action.type)
  console.log('The action: ', action)
  console.log('The new state: ', store.getState())
  console.groupEnd()
  return returnValue
}

export default logger
