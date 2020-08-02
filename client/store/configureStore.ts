import { createStore } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import { RootState, rootReducer } from '../redux/reducers'

export const configureStore = (initialState: RootState) => {
  return createStore(rootReducer, initialState, devToolsEnhancer({}))
}
