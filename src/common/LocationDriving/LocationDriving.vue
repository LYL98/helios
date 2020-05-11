<template>
  <div style="min-width: 500px; min-height: 300px;">
    <div id="amap"></div>
  </div>
</template>

<script>
const MAP_STYLE = "amap://styles/light";
const ICON_CENTER_POINT = require("./center.png");
//线路起始点的点标记
const ICON_MARKER_START = [
  require("./start_1.png"),
  require("./start_2.png"),
  require("./start_3.png"),
  require("./start_4.png"),
  require("./start_5.png"),
  require("./start_6.png"),
  require("./start_7.png"),
  require("./start_8.png"),
  require("./start_9.png"),
  require("./start_10.png"),
]
//线路上的点标记
const ICON_MARKER_POINT = [
  require("./marker_1.png"),
  require("./marker_2.png"),
  require("./marker_3.png"),
  require("./marker_4.png"),
  require("./marker_5.png"),
  require("./marker_6.png"),
  require("./marker_7.png"),
  require("./marker_8.png"),
  require("./marker_9.png"),
  require("./marker_10.png"),
];
//线路颜色
// #94DAF1  #AFE3C3  #FAD2AE  #D4BAEC   #F1C4C4  #BADBE1  #D9E3AF  #B5BBE0
// #ECBACE  #E9DBAA
const COLOR_LINE = [
  '#94DAF1',
  '#AFE3C3',
  '#FAD2AE',
  '#D4BAEC',
  '#F1C4C4',
  '#BADBE1',
  '#D9E3AF',
  '#B5BBE0',
  '#ECBACE',
  '#E9DBAA',
]

export default {
  name: "LocationDriving",
  props: {
    center: { type: Object, default: () => ({ lng: "", lat: "" }) },
    mapDatas:{type: Array,default: () => []}
  },
  data() {
    return {
      mapComplete: false,
    };
  },
  watch: {
    center: {
      deep: true,
      immediate: false,
      handler: function(next, pre) {
        if (next && next.lng && next.lat) {
          if (this.map) {
            this.map.setCenter([next.lng, next.lat]);
            this.$data.mapComplete && this.initCenterPoint(next.lng, next.lat);
          }
        }
      }
    },
    mapDatas: {
      deep: true,
      immediate: false,
      handler: function(next, pre) {
        if (this.map) {
          //next
          this.$data.mapComplete && this.initMap();
        }
      }
    }
  },
  mounted() {
    this.initMap();
  },
  beforeDestroy() {
    this.destroyMap();
  },
  methods: {
    //初始化地图
    initMap() {
      let config = {
        zoom: 8,
        isHotspot: false,
        scrollWheel: true,
        mapStyle: MAP_STYLE
      };

      let center = this.$props.center;
      let that = this;
      if (center && center.lng && center.lat) {
        config.center = [center.lng, center.lat];
      }

      this.map = new AMap.Map("amap", config);

      let allMyData = this.$props.mapDatas
      let tempDatas = []
      let needDatas = []
      let markerDatas = []
      allMyData.map((item,index)=>{
          tempDatas.push([
            item.geo.lng,
            item.geo.lat
          ])
          item.stores.map((v,idx)=>{
              tempDatas.push([
                v.geo.lng,
                v.geo.lat
              ])
          })
          // markerDatas.push(item.stores)
          needDatas.push(tempDatas)
      })
      
      allMyData.map((item,index)=>{
        
          markerDatas.push(item.stores)
      })
    
      // this.initLine(needDatas)
      // allLocations.map((v,index) => {
      //   AMap.plugin("AMap.Driving", function() {
      //     //异步同时加载多个插件
      //     var driving = new AMap.Driving({
      //       map: that.map,
      //       hideMarkers: true,
      //       outlineColor: '#fff'
      //     }); //驾车路线规划
      //     // driving.search(startLngLat, endLngLat, {
      //     //   waypoints: waypoints
      //     // });
      //       driving.search(allLocations[index], allLocations[index + 1]);

      //     // driving.search()
      //   });
      //   return v
      // });
        that.initLine(needDatas)

      this.map.on("complete", () => {
        this.$data.mapComplete = true;
        if (center && center.lng && center.lat) {
          this.initCenterPoint(center.lng, center.lat);
        }
        that.initMarkerPoint(allMyData,markerDatas);//绘制图标
      });
    },

    //销毁地图
    destroyMap() {
      // this.centerPoint && this.map.remove(this.centerPoint);
      this.map && this.map.destroy();
    },

    // 初始化中心点
    initCenterPoint(lng, lat) {
      if (this.centerPoint) {
        this.centerPoint.setPosition([lng, lat]);
        return;
      }

      let marker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        icon: ICON_CENTER_POINT,
        offset: new AMap.Pixel(-38, -76),
        draggable: false
      });

      this.centerPoint = marker;
      this.map.add(marker);
    },
    //添加点图标
    initMarkerPoint(allMyData,markerDatas) {
      // 点标记显示内容，HTML要素字符串
      //index == 0 ?ICON_MARKER_START[indexAll]:ICON_MARKER_POINT[indexAll]
      var markerContent = (indexAll, index) => {
        return `<div class="custom-content-marker">
          <img src=${ICON_MARKER_POINT[indexAll]}>
        <div class="close-btn">${index+1}</div>
        </div>`;
      };
      //设置起点图标
       var markerStart = (index) => {
        return `<div class="marker-start">
          <img src=${ICON_MARKER_START[index]}>
        <div class="close-btn"></div>
        </div>`;
      };
      //鼠标移入点图标事件
      function showLabel(e){
        let data = e.target.getExtData()
        this.setLabel({
          content: data.title,
           direction: 'top'
        })
      }
      //鼠标移开事件
       function showLabelOut(e){
        this.setLabel({
          content: '',
        })
      }
      //图标
      //设置起点图标
      allMyData.map((item,index)=>{
        let marker = new AMap.Marker({
            position: [item.geo.lng, item.geo.lat],
            content: markerStart(index),
            offset: new AMap.Pixel(0, 0),
            draggable: false,
            extData: item
          });
          marker.on('mouseover', showLabel);
          marker.on('mouseout', showLabelOut);
          this.map.add(marker);
      })

      //设置除了起点的图标
      markerDatas.map((item, indexAll) => {
        item.map((v, index) => {
          let marker = new AMap.Marker({
            position: [v.geo.lng, v.geo.lat],
            content: markerContent(indexAll, index),
            offset: new AMap.Pixel(-26, -52),
            draggable: false,
            extData: v
          });
          marker.on('mouseover', showLabel);
          marker.on('mouseout', showLabelOut);
          this.map.add(marker);
        });
      });
    },
    //绘制线路
    initLine(needDatas){
        let that = this
      console.log(needDatas);
      
      //that.map 同步
        needDatas.map((item,indexColor) => {
        item.map((v, index) => {
          AMap.plugin("AMap.Driving", function() {
            //异步同时加载多个插件
            var driving = new AMap.Driving({
              map: that.map,
              hideMarkers: true,
              outlineColor: "#fff",
              autoFitView:  true,
              // showTraffic:false,//实时路况
              policy: AMap.DrivingPolicy.LEAST_TIME //最快捷模式
            }); //驾车路线规划
            // driving.search(startLngLat, endLngLat, {
            //   waypoints: waypoints
            // });
            //item[index], item[index + 1]
          // [item[index].geo.lng,item[index].geo.lat]
            driving.search(item[index], item[index + 1], (status, result) => {
              if (status === "complete") {
                const { routes = [] } = result;
                // const { steps = [] } = routes[0];
                // const pathArr = [];
                // steps.map(i => {
                //   pathArr.push(i.path);
                //   return pathArr;
                // });
                // const path = flatten(pathArr)
                const path = parseRouteToPath(routes[0]);
                //绘制轨迹线路
                function parseRouteToPath(route) {
                  const path = [];
                  for (let i = 0, l = route.steps.length; i < l; i++) {
                    const step = route.steps[i];
                    for (let j = 0, n = step.path.length; j < n; j++) {
                      path.push(step.path[j]);
                    }
                  }
                  return path;
                }
                //绘制轨迹
                const polyline = new AMap.Polyline({
                  map: that.map,
                  path: path,
                  showDir: true,
                  strokeColor: COLOR_LINE[indexColor], // 线颜色
                  strokeOpacity: 1, // 线透明度
                  strokeWeight: 5, // 线宽
                  strokeStyle: "solid", // 线样式
                  lineJoin: "round", // 折线拐点的绘制样式
                  zIndex: 999
                });
                polyline.setMap(that.map);
                
              }
            });
          });
          return v;
        });
      });
    }
  }
};
</script>

<style  scoped>
#amap {
  width: 100%;
  height: 100%;
}
#amap >>> .custom-content-marker {
  position: relative !important;
  width: 38px;
  height: 38px;
}
#amap >>> .custom-content-marker img {
  display: block;
  width: 100%;
  height: 100%;
}
#amap >>> .custom-content-marker .close-btn {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #fff;
  font-weight: 700;
}
/* marker-start */
#amap >>> .marker-start {
  position: relative !important;
  width: 20px;
  height: 20px;
}
#amap >>> .marker-start img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
