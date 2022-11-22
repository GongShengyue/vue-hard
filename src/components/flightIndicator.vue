<template>
  <div id="app">
    <div class="indicators">
      <Attitude class="indicator-bg" :size="200" :roll="roll" :pitch="pitch" />
      <Heading class="indicator-bg" :size="200" :heading="heading" />
      <Variometer class="indicator-bg" :size="200" :vario="vario" />
      <Airspeed class="indicator-bg" :size="200" :airspeed="airspeed" />
      <Altimeter
        class="indicator-bg"
        :size="200"
        :altitude="altitude"
        :pressure="pressure"
      />
      <h1>起落架状态{{ landinggear }}</h1>

      <div class="mui-input-row mui-input-range">
        <label>油门</label>
        <input type="range" min="0" max="100" />
      </div>
      <br>
      <br>
      <div class="btnArea">
        <div class="mui-switch mui-active">
          <div class="mui-switch-handle"></div>
        </div>
        <button id="importBtn" type="button" @click="importPlan" class="mui-btn mui-btn-primary">从simbrief导入Plan</button>
    </div>
    </div>
    <div id="myMap" style="position:relative;width:100%;height:600px;"></div>
  </div>
</template>

<script>
import axios from "axios";
import plane from "./icons/plane.png"
import simbrieficon from "./icons/simbrief.png"
import {
  Airspeed,
  Attitude,
  Altimeter,
  Heading,
  Variometer,
} from "vue-flight-indicators";

export default {
  name: "app",
  components: {
    Attitude,
    Heading,
    Variometer,
    Airspeed,
    Altimeter,
  },
  data: function () {
    return {
      map:{},
      watchId:'', 
      userPin:{},
      //BingMap_URL:'http://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=' + 'AgJUPuYlitfpwBJgy7v41W73ld7yTbZ4r54mH5my6EyXSIWFJrI9oBpMAAZsL4ER',
      counter: 0,
      planeIcon:plane,
      roll: 0,
      pitch: 0,
      heading: 0,
      vario: 0,
      airspeed: 0,
      altitude: 0,
      pressure: 0,
      landinggear: 0,
      beaconLight:0,//信标灯
      wingLight:0,//翼灯
      //航行灯
      landingLight:0,//着陆灯
      timer: "",
      timer_location_update:'',
      latitude:0.0,
      longitude:0.0
      
    };
  },
  methods: {
     GetMap() {
        this.map = new Microsoft.Maps.Map('#myMap');
        //Request the user's location
        let that = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            var loc = new Microsoft.Maps.Location(
                position.coords.latitude,
                position.coords.longitude);

            //Add a pushpin at the user's location.
            var pin = new Microsoft.Maps.Pushpin(loc,{
              icon: './icons/plane.png',
              anchor: new Microsoft.Maps.Point(12, 39)
            
            }
              );
            that.map.entities.push(pin);

            //Center the map on the user's location.
            that.map.setView({ center: loc, zoom: 15 });
        });
    },
    stratTracking(){
      console.log("开始跟踪");
      this.userPin = new Microsoft.Maps.Pushpin(this.map.getCenter(), { visible: false });
      this.map.entities.push(this.userPin);
      this.timer_location_update =window.setInterval(this.locationUpdated,1000,this.map);
      //Watch the users location.
      //this.watchId = navigator.geolocation.watchPosition(this.locationUpdated);

    },
    locationUpdated(map){
      console.log("locationUpdated");
      
      var that = this;
      var loc = new Microsoft.Maps.Location(this.latitude,this.longitude);
        console.log(this.latitude);
        console.log(this.longitude);
        //Update the user pushpin.
        // this.userPin.setLocation(loc);
        
        // this.userPin.setOptions({ visible: true,
        //   icon: that.planeIcon,
        //   anchor: new Microsoft.Maps.Point(12, 39)
          
        // });
        
        that.createRotatedImagePushpin(loc,that.planeIcon,360-that.heading,function(pin){
          // map.entities.push(pin);
        });

        //Center the map on the user's location.
        this.map.setView({ center: loc });
    },
    init: function (){
      console.log("初始化bing地图脚本...");
      // bing map key
      const bingUesrKey = '你的bingMap Key';
      const BingMap_URL = 'http://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=' + 'AgJUPuYlitfpwBJgy7v41W73ld7yTbZ4r54mH5my6EyXSIWFJrI9oBpMAAZsL4ER';
      return new Promise((resolve, reject) => {
        if(typeof Microsoft !== "undefined") {
          resolve(Microsoft);
          return true;
        }

        // 插入script脚本
        let scriptNode = document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.setAttribute("src", BingMap_URL);
        document.body.appendChild(scriptNode);

        // 等待页面加载完毕回调
        let timeout = 0;
        let interval = setInterval(() => {
          // 超时10秒加载失败
          if(timeout >= 20) {
            reject();
            clearInterval(interval);
            console.error("bing地图脚本初始化失败...");
          }
          // 加载成功
          if(typeof Microsoft !== "undefined") {
            resolve(Microsoft);
            clearInterval(interval);
            console.log("bing地图脚本初始化成功...");
            
          }
          timeout += 1;
        }, 2000);
      });
    },
    createRotatedImagePushpin(location, url, rotationAngle, callback) {
        var img = new Image();
        var that = this;
        
        img.onload = function () {
            var canvasWidth = Math.max(img.width, img.height);
            var c = document.createElement('canvas');
            c.width = canvasWidth;
            c.height = canvasWidth
            var rotationAngleRads = rotationAngle * Math.PI / 180;
            // console.load("rorateAngleRads")
           //Calculate rotated image size.
            // c.width = Math.abs(Math.ceil(img.width * Math.cos(rotationAngleRads) + img.height * Math.sin(rotationAngleRads)));
            // c.height = Math.abs(Math.ceil(img.width * Math.sin(rotationAngleRads) + img.height * Math.cos(rotationAngleRads)));
            
            var context = c.getContext('2d');

            //Move to the center of the canvas.
            context.translate(c.width / 2, c.height / 2);

            //Rotate the canvas to the specified angle in degrees.
            context.rotate(rotationAngleRads);

            //Draw the image, since the context is rotated, the image will be rotated also.
            // context.drawImage(img, -c.height / 2, -c.width / 2);
            context.drawImage(img, -img.width / 2, -img.height / 2);
            

            // context.drawImage(img,-img.width,-img.height);
            
            // var pin = new Microsoft.Maps.Pushpin(location, {
            //     //Generate a base64 image URL from the canvas.
            //     icon: c.toDataURL(),
            //     anchor: new Microsoft.Maps.Point(c.width / 2, c.height / 2) //Anchor to center of image.
            // });
            
            that.userPin.setLocation(location);
            that.userPin.setOptions({ visible: true,
              icon: c.toDataURL(),
              anchor: new Microsoft.Maps.Point(c.width / 2, c.height / 2) //Anchor to center of image.
          
          });


            if (callback) {
                callback(that.userPin);
            }
        };

        //Allow cross domain image editting.
        img.crossOrigin = 'anonymous';
        img.src = url;
    },
    importPlan(){
      mui.prompt('请输入simbrief用户名','deftext','Input user info',['true','false'],function(e){
        if(e.index ==0){
          mui.toast(e.value);
          var api = "https://www.simbrief.com/api/xml.fetcher.php?username="+e.value+"&json=1";
          axios
          .get(api)
          .then((res) => {
            //请求成功的回调函数
            debugger
            mui.toast("出发地:"+res.data.origin.iata_code+"\n"+"经度："+res.data.origin.pos_lat+" 纬度："+res.data.origin.pos_long); 
          })
          .catch((err) => {
            //请求失败的回调函数
            //计划修改成ios7样式的弹窗提示
            console.log(err);
          });
    }
        
      },'div') 
    } 


  },
  commputed:{
    // locationListen(){
    //   return {latitude,longitude}
    // }
  },
  watch:{
    // landinggear: function (newPos,oldPos) {
        // if(newPos==1){
        //   mui.alert('text','起落架升起','title',['true','false'],null,'div');  
        // }
        // else if(newPos == 2){
        //   mui.alert('text','起落架放下','title',['true','false'],null,'div');
        // }

    },
    // locationListen(val,oldval){
    //   if((val.latitude!=oldval.latitude)||(val.longitude!=oldval.longitude)){
    //     var loc = new Microsoft.Maps.Location(
    //                 this.latitude,
    //                 this.longitude);
    //     console.log(this.latitude);
    //     console.log(this.longitude);
        
    //     //Update the user pushpin.
    //     this.userPin.setLocation(loc);
    //     this.userPin.setOptions({ visible: true });

    //     //Center the map on the user's location.
    //     this.map.setView({ center: loc });
    //   }
    // }
    
  
  created:function(){
    let that = this;
     this.init().then((Microsoft)=>{
      this.GetMap();//渲染地图--gsy
      this.stratTracking();//开始跟踪--gsy
     })
     
    
  },
  mounted: function () {
    mui('.mui-switch')['switch']();
    
    setInterval(() => {
      this.roll = 30 * Math.sin(this.counter / 10);
      this.pitch = 50 * Math.sin(this.counter / 20);

      // this.heading = this.counter;

      //this.vario = 2 * Math.sin(this.counter / 10);

      // this.airspeed = 80 + 80 * Math.sin(this.counter / 10);

      //this.altitude = 10 * this.counter;
      this.pressure = 1000 + 3 * Math.sin(this.counter / 50);

      this.counter++;
    }, 35);

    this.timer = setInterval(() => {
      var api = "http://localhost:8080/getFlightData";
      //2.使用axios 进行get请求
      axios
        .get(api)
        .then((res) => {
          //请求成功的回调函数
          this.airspeed = res.data.data.airspeed_Indicated;
          this.altitude = res.data.data.plane_ALTITUDE;
          this.heading = 360-res.data.data.plane_HEADING_DEGREES_GYRO;//github自带的陀螺仪是反着的。。。
          this.landinggear = res.data.data.gear_POSITION;
          this.vario = res.data.data.vertical_SPEED;
          this.latitude = res.data.data.plane_LATITUDE;
          this.longitude = res.data.data.plane_LONGITUDE;
          // console.log("this.latitude="+this.latitude);
          // console.log("this.longitude="+this.longitude);
        })
        .catch((err) => {
          //请求失败的回调函数
          //计划修改成ios7样式的弹窗提示
          console.log(err);
        });
    }, 1000);
    
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    window.clearInterval(this.timer_location_update);
  },
}
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 60px;
}
.indicator-bg {
  background-color: grey;
}
.btnArea{
  display: flex;
}
#importBtn{
  background: url("./icons/simbrief.png");
  color: lightslategray
}
.bm_bottomRightOverlay{
  display: none;
}
</style>
