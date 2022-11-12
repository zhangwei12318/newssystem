//引入createStore，专门用于创建redux中最为核心的store对象
import { createStore, applyMiddleware,combineReducers } from "redux";
// 引入为reducer
import CollapsedReducer from "./reducers/collapsed";
import LoadingReducer from './reducers/loading'
//引入使状态持久化的包
import {persistStore,persistReducer} from 'redux-persist'
import storage from "redux-persist/lib/storage";
//引入redux-devtools-extension
import{composeWithDevTools} from 'redux-devtools-extension'
//引入中间件,执行异步任务
import thunk from 'redux-thunk'

const persistConfig = {
    key: 'kerwin',
    storage,
    blacklist:['isLoading']
  }
  
//合并reducers
const allReducers=combineReducers({
    // count:countReducer,
    isCollapsed:CollapsedReducer,
    isLoading:LoadingReducer
    // person:personReducer
})
const persistedReducer = persistReducer(persistConfig, allReducers)

// 暴露store
 const store=createStore(persistedReducer,composeWithDevTools(applyMiddleware(thunk)));
 const persistor=persistStore(store)
 export { store,persistor}