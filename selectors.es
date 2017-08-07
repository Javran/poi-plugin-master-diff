import _ from 'lodash'
import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import {
  extensionSelectorFactory,
} from 'views/utils/selectors'

import { initState } from './store'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-master-diff'),
  ext => _.isEmpty(ext) ? initState : ext)

const mkExtPropSelector = _.memoize(propName =>
  createSelector(extSelector, ext => ext[propName]))

const currentMasterSelector =
  mkExtPropSelector('currentMaster')

const recordSelector =
  mkExtPropSelector('record')

const recordReadySelector = createSelector(
  recordSelector,
  r => r.ready
)

const recordDataSelector = createSelector(
  recordSelector,
  r => r.data
)

const recordMasterSelector = createSelector(
  recordDataSelector,
  r => _.get(r,'masterData',null)
)

const recordDiffSelector = createSelector(
  recordDataSelector,
  r => _.get(r,'diffData',null)
)

const mastersViewSelector = createStructuredSelector({
  ready: recordReadySelector,
  recordMaster: recordMasterSelector,
  currentMaster: currentMasterSelector,
})

export {
  extSelector,
  currentMasterSelector,
  recordReadySelector,
  recordDataSelector,
  recordMasterSelector,
  recordDiffSelector,
  mastersViewSelector,
}
