import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      count: 1,
      fanspeed:1500,
      temprature:45
    }
  },
  mutations:{
    updateTemp(state,newtemp){
      this.state.temprature = newtemp;
      console.log("执行温度vuex修改");
    }
  }
 
})