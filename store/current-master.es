// this reducer records latest normalized `api_start2` data.
import { store } from 'views/create-store'
import { normalizeData } from 'subtender'

const tyReplace = '@poi-plugin-master-diff@currentMaster@Replace'

/*
   when the state is not null, it's an Object of following structure:

   - masterData: Object
   - time: Number

 */
const reducer = (state = null, action) => {
  if (action.type === '@@Response/kcsapi/api_start2') {
    const {time, body} = action
    store.dispatch(dispatch => setTimeout(() => {
      const data = normalizeData(body)
      dispatch({
        type: tyReplace,
        newState: {data, time},
      })
    }))
    return state
  }

  if (action.type === tyReplace) {
    const {newState} = action
    return newState
  }
  return state
}

export {
  reducer,
}
