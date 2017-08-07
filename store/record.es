// this reducer keeps previous records if any
import { store } from 'views/create-store'
import { readLatestRecord } from '../records'

const tyRequestLoad = '@poi-plugin-master-diff@record@RequestLoad'
const tyData = '@poi-plugin-master-diff@record@Data'

const initState = {
  ready: false,
  data: null,
}

const reducer = (state = initState, action) => {
  if (action.type === tyRequestLoad) {
    store.dispatch(dispatch => setTimeout(() => {
      try {
        const record = readLatestRecord()
        dispatch({type: tyData, data: record})
      } catch (err) {
        console.error('error while reading records', err)
      }
    }))

    return state
  }

  if (action.type === tyData) {
    const {data} = action
    return {ready: true, data}
  }
  return state
}

const actionCreator = {
  recordRequestLoad: () => ({type: tyRequestLoad}),
}

export { reducer, actionCreator }
