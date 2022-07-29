import { legacy_createStore as createStore, combineReducers } from 'redux'
import { CollApsedReducer } from './reducer/CollapsedReducer'
import { SpinningReducer } from './reducer/SpinningReducer';


import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
     key: 'root',
     storage,
     blacklist: ['SpinningReducer'] // navigation will not be persisted
}

const reducer = combineReducers({
     CollApsedReducer,
     SpinningReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)


const store = createStore(persistedReducer);
const persistor = persistStore(store)

export { store, persistor }
/*
store创建出来是基于订阅发布模式来的
store.dispatch()分发到reducer中，处理后接收老状态，返回一个新状态

 store.subscribe()再某个组件中使用，监听回调函数会被触发

 引用react-redux就可以不用自己取手动dispatch和subscribe
 */ 