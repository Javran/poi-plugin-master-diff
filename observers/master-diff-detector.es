import { observer } from 'redux-observers'
import { diff } from 'deep-diff'
import _ from 'lodash'

import {
  mastersViewSelector,
} from '../selectors'
import { writeRecord } from '../records'
import { withBoundActionCreator } from '../store'

// traverse the structure, convert every Array whose elements have
// 'api_id' property into an Object with `api_id` being the key
const deepIndexify = val => {
  if (val === null || typeof val !== 'object')
    return val

  if (Array.isArray(val)) {
    const xs = val.map(deepIndexify)
    if (xs.length === 0)
      return xs

    const x = xs[0]

    if (x === null || typeof x !== 'object')
      return xs

    if ('api_id' in xs[0]) {
      if (xs.some(x2 => !('api_id' in x2))) {
        return xs
      }

      const ids = xs.map(x2 => x2.api_id)
      if (ids.length !== _.uniq(ids).length) {
        return _.groupBy(xs,'api_id')
      } else {
        return _.keyBy(xs,'api_id')
      }
    }
    return xs
  } else {
    return _.mapValues(val,deepIndexify)
  }
}

const masterDiffDetector = observer(
  mastersViewSelector,
  (dispatch, cur, _prev) => {
    const {ready, recordMaster, currentMaster} = cur
    if (
      ready && recordMaster && currentMaster &&
      recordMaster.time !== currentMaster.time
    ) {
      const diffResult = diff(
        deepIndexify(recordMaster.data),
        deepIndexify(currentMaster.data)
      )

      if (diffResult)
        setTimeout(() => {
          const diffData = {
            lhsTime: recordMaster.time,
            rhsTime: currentMaster.time,
            results: diffResult,
          }
          try {
            writeRecord(currentMaster,diffData)
            withBoundActionCreator(
              bac => bac.recordRequestLoad(),
              dispatch
            )
          } catch (e) {
            console.error('error while writing new record', e)
          }
        })
    }
  }
)

export { masterDiffDetector }
