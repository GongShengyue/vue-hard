<template>
  <div>
    <router-view>
    <div>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <ul>
            <li id="motherboard">
              <span class="icon">
                <img :src="getBrandIcon()" alt="" />
              </span>

              {{ brand }}
            </li>
            <li id="cpu">
              <span class="icon">
                <img :src="getCpuIcon()" alt="" />
              </span>

              cpu占用--{{ cputrix }}%   温度：{{cputemprature}}℃
            </li>
            <li id="ram">
              <span class="icon">
                <img src="./icons/内存条.png" alt="" />
              </span>
              内存占用
              {{ RamRate }}
            </li>
            <li id="gpu">
              <span class="icon">
                <img
                  src="./icons/technology_pci-card.png"/>
                <!-- :style="{ transform: 'rotate(' + angle + 'deg)' }" -->
              </span>
              <!-- cpu风扇转速 {{ cpufanSpeed }} -->
              {{GPUname}}
            </li>
            <li id="ssd"></li>
            <li class="network"></li>
          </ul>
        </el-main>
      </el-container>
    </div>
    </router-view>
  </div>
</template>

<script>
import axios from "axios";
import { store } from "../store";
export default {
  name: "app",
  components: [],
  data() {
    return {
      brand: "Apple",
      siralId: "jdksahd231",
      cputrix: 0,
      cpufanSpeed: 3600,
      cputemprature: 56.0,
      RamUse: 20,
      RamTotal: 70,
      timer: "", //请求定时器
      fantimer: "", //风扇旋转定时器
      cpuicon_color: "",
      angle: 0.5,
      GPUname:""
      //内存占用率
    };
  },
  methods: {
    getAssetsImages(name) {
      return new URL(`./icons/${name}`, import.meta.url).href;
    },
    refreshInfo() {
      //var api = "http://localhost:8080/getinfo";
    //   var api = "http://192.168.0.103:8080/getinfo";
       var api = "http://192.168.0.109:8080/getinfo";
      //2.使用axios 进行get请求
      axios
        .get(api)
        .then((res) => {
          //请求成功的回调函数
          this.brand = res.data.brand;
          this.cputrix = (res.data.cputick * 100).toFixed(2);
          this.cpufanSpeed = res.data.fanSpeed;
          this.cputemprature = res.data.temprature;
          // store.commit('updateTemp',this.cputemprature);
          localStorage.setItem('temprature',this.cputemprature);
          this.RamUse = res.data.totalRAM - res.data.availableRAM;
          this.RamTotal = res.data.totalRAM;
          this.GPUname = res.data.gpuinfo[0].name;
        })
        .catch((err) => {
          //请求失败的回调函数
          console.log(err);
        });
      // this.angle=this.angle + 20;
    },
    getCpuIcon() {
      if (this.cputemprature > 40.0) {
        return this.getAssetsImages("cpu-red.png");
      } else {
        return this.getAssetsImages("cpu-green.png");
      }
    },
    getBrandIcon() {
      if (this.brand == "Apple Inc.") {
        return this.getAssetsImages("Apple.png");
      } else {
        return this.getAssetsImages("intel.png");
      }
    },
    //旋转风扇动画
    rotateFan() {
      this.angle = this.angle + 6;
    },
    //旋转频率
    rotateFps() {
      if (this.cpufanSpeed == 0) {
        return 10000000;
      }
      return 3800 - this.cpufanSpeed;
    },
  },
  watch: {
    //   //监听当品牌改变时改变图标
    //   cputemprature: function (newTem, OldTem) {
    //     if(newTem>60){
    //       $("#cpu").children[0].children[0].setAttribute("src","./components/icons/cpu-red.png");
    //     }else{
    //       $("#cpu").children[0].children[0].setAttribute("src","./components/icons/cpu-red.png");
    //     }
    //   this.answer = 'Waiting for you to stop typing...'
    //   this.debouncedGetAnswer()
    // }
  },
  computed: {
    style() {
      return { transform: "rotate(" + this.angle + "angle)" };
    },
    RamRate() {
      return ((this.RamUse / this.RamTotal) * 100).toFixed(2) + "%";
    },
  },
  mounted() {
    this.timer = window.setInterval(this.refreshInfo, "1500");
    this.fantimer = window.setInterval(this.rotateFan, 800);
  },
  updated() {},
  beforeDestroy() {
    window.clearInterval(timerId2);
    window.clearInterval(fantimer);
  },
};
</script>
<style>
ul {
  padding: inherit;
  font-family: "Garamond";
}

li {
  height: 100px;
  list-style-type: none;
  border: 0.5px solid #dcdfe6;
  display: flex;
  line-height: 100px; /*设置line-height与父级元素的height相等*/
}
li img {
  position: relative;
  top: 10px;
}
.icon {
  width: 80px;
  height: 100%;
}
#motherboard {
  background-color: rgba(151, 151, 151, 0.5);
}
#ram {
  background-color: rgba(247, 181, 0, 0.5);
}
#cpu {
  background-color: rgba(0, 145, 255, 0.5);
}
#gpu {
  background-color: rgba(68, 215, 182, 0.5);
}
#ssd {
  background-color: #de53ef57;
}
</style>
