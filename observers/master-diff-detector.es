import { observer } from 'redux-observers'
import { diff } from 'deep-diff'
import { deepIndexify } from 'subtender/kc'

import {
  mastersViewSelector,
} from '../selectors'
import { writeRecord } from '../records'
import { withBoundActionCreator } from '../store'

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
