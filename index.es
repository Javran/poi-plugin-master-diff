import {
  reducer,
  withBoundActionCreator,
} from './store'

import {
  globalSubscribe,
  globalUnsubscribe,
} from './observers'

const pluginDidLoad = () => {
  globalSubscribe()
  withBoundActionCreator(bac =>
    bac.recordRequestLoad())
}

const pluginWillUnload = () => {
  globalUnsubscribe()
}

export {
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
