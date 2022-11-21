import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import "./static/lib/dist/css/mui.min.css"
import './assets/main.css'


let orignalSetItem = window.localStorage.setItem;   // 原生localStorage.setItem方法
localStorage.setItem = function(key,newValue){
  let setItemEvent = new Event("setItemEvent");  // 重写注册setItem
  setItemEvent.key = key;                        
  setItemEvent.newValue = newValue;              
  window.dispatchEvent(setItemEvent);            // 派发setItem
  orignalSetItem.apply(this, arguments);         // 设置值
}
const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app')
