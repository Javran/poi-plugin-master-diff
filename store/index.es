import { store } from 'views/create-store'
import {
  combineReducers,
  bindActionCreators,
} from 'redux'

import { reducer as currentMaster } from './current-master'
import {
  reducer as record,
  actionCreator as recordAC,
} from './record'

const reducer = combineReducers({
  currentMaster,
  record,
})

const initState = reducer(undefined, {type: '@@INIT'})

const actionCreator = recordAC

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreator, dispatch)

const withBoundActionCreator = (func, dispatch=store.dispatch) =>
  func(mapDispatchToProps(dispatch))

const asyncBoundActionCreator = (func, dispatch=store.dispatch) =>
  dispatch(() => setTimeout(() =>
    withBoundActionCreator(func, dispatch)))

export {
  reducer,
  initState,

  actionCreator,
  mapDispatchToProps,
  withBoundActionCreator,
  asyncBoundActionCreator,
}
