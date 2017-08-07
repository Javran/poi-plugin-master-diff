import { observer } from 'redux-observers'

import {
  mastersViewSelector,
} from '../selectors'
import { writeRecord } from '../records'
import { withBoundActionCreator } from '../store'

const initialRecordWriter = observer(
  mastersViewSelector,
  (dispatch, cur, _prev) => {
    const {ready, recordMaster, currentMaster} = cur
    if (
      ready &&
      recordMaster === null &&
      currentMaster !== null
    ) {
      setTimeout(() => {
        try {
          writeRecord(currentMaster,null,true)
          withBoundActionCreator(
            bac => bac.recordRequestLoad(),
            dispatch
          )
        } catch (e) {
          console.error('error while writing initial record', e)
        }
      })
    }
  }
)

export { initialRecordWriter }
