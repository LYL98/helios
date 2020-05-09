<template>
  <div style="min-width: 500px; min-height: 300px;">
    <div id="amap"></div>
  </div>
</template>

<script>
const MAP_STYLE = "amap://styles/light";
const ICON_CENTER_POINT = require("./center.png");
//线路起始点的点标记
const ICON_MARKER_START = {
  
}
//线路上的点标记
const ICON_MARKER_POINT = [
  require("./marker_blue.png"),
  require("./marker_green.png"),
  require("./marker_orange.png"),
  require("./marker_purple.png"),
  require("./marker_red.png"),
  require("./marker_greyBlue.png")
];
//线路颜色
const COLOR_LINE = [
  '#1daee5',
  '#49c377',
  '#fd994b',
  '#9f61d7',
  '#e67778',
  '#62b1be'
]

export default {
  name: "LocationDriving",
  props: {
    marker: { type: Array, default: () => [] },
    center: { type: Object, default: () => ({ lng: "", lat: "" }) }
  },
  data() {
    return {
      mapComplete: false,
      allLocations:[
        [116.379028, 39.865042],
        [116.379028, 39.885042],
        [116.379028, 34.885042],
        [116.379028, 33.885042],
        [116.379028, 32.88],
        [116.379028, 32.86],
        [116.379028, 32.85],
        [116.379028, 32.84],
        [116.379028, 32.83],
        [116.379028, 32.82],
        [116.379028, 32.81],
        [116.379028, 32.8],
        [116.379028, 32.79],
        [116.379028, 32.78],
        [116.379028, 32.77],
        [116.379028, 32.76],
        [116.379028, 32.75],
        [116.379028, 31.74],
        [116.427281, 31.603719]
      ],
      allLocations2:[
        [115.379028, 39.885042],
        [115.379028, 34.885042],
        [115.379028, 33.885042],
        [115.379028, 32.88],
        [115.379028, 32.86],
        [115.379028, 32.85],
        [115.379028, 32.84],
        [115.379028, 32.83],
        [115.379028, 32.82],
        [115.379028, 32.81],
        [115.379028, 32.8],
        [115.379028, 32.79],
        [115.379028, 32.78],
        [115.379028, 32.77],
        [115.379028, 32.76],
        [115.379028, 32.75],
        [115.379028, 31.74]
      ],
      allData:[]
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
    marker: {
      deep: true,
      immediate: false,
      handler: function(next, pre) {
        if (this.map) {
          this.$data.mapComplete && this.initMarkerPoint(next);
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
      this.initLine()
      let allData = [this.$data.allLocations, this.$data.allLocations2];
      // allData.map((item,indexColor) => {
      //   item.map((v, index) => {
      //     AMap.plugin("AMap.Driving", function() {
      //       //异步同时加载多个插件
      //       var driving = new AMap.Driving({
      //         map: that.map,
      //         hideMarkers: true,
      //         outlineColor: "#fff"
      //       }); //驾车路线规划
      //       // driving.search(startLngLat, endLngLat, {
      //       //   waypoints: waypoints
      //       // });
      //       driving.search(item[index], item[index + 1], (status, result) => {
      //         if (status === "complete") {
      //           const { routes = [] } = result;
      //           // const { steps = [] } = routes[0];
      //           // const pathArr = [];
      //           // steps.map(i => {
      //           //   pathArr.push(i.path);
      //           //   return pathArr;
      //           // });
      //           // const path = flatten(pathArr)
      //           const path = parseRouteToPath(routes[0]);
      //           //绘制轨迹线路
      //           function parseRouteToPath(route) {
      //             const path = [];
      //             for (let i = 0, l = route.steps.length; i < l; i++) {
      //               const step = route.steps[i];
      //               for (let j = 0, n = step.path.length; j < n; j++) {
      //                 path.push(step.path[j]);
      //               }
      //             }
      //             return path;
      //           }
      //           //绘制轨迹
      //           const polyline = new AMap.Polyline({
      //             map: that.map,
      //             path: path,
      //             showDir: true,
      //             strokeColor: COLOR_LINE[indexColor], // 线颜色
      //             strokeOpacity: 1, // 线透明度
      //             strokeWeight: 5, // 线宽
      //             strokeStyle: "solid", // 线样式
      //             lineJoin: "round", // 折线拐点的绘制样式
      //             zIndex: 999
      //           });
      //           polyline.setMap(that.map);
      //         }
      //       });

      //       // driving.search()
      //     });
      //     return v;
      //   });
      // });
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

      // 点标记显示内容，HTML要素字符串
      // var markerContent = (indexAll, index) => {
      //   return `<div class="custom-content-marker">
      //     <img src=${ICON_MARKER_POINT[indexAll]}>
      //   <div class="close-btn">${index == 0 ? "起" : index}</div>
      //   </div>`;
      // };
      //起点图标
      // let circle = new AMap.Circle({
      //     map:that.map,
      //     center: new AMap.LngLat(startLngLat[0], startLngLat[1]),
      //     fillColor: "#0f0", //填充色
      //     radius: 15,
      //   });

      //图标
      // allData.map((item, indexAll) => {
      //   item.map((v, index) => {
      //     let marker = new AMap.Marker({
      //       position: new AMap.LngLat(v[0], v[1]),
      //       content: markerContent(indexAll, index),
      //       offset: new AMap.Pixel(-26, -52),
      //       draggable: false,
      //       title: "北京",
      //       label: {
      //         content: ""
      //       }
      //     });
      //     this.map.add(marker);
      //   });
      // });
      // allLocations.map((v, index) => {
      //   let marker = new AMap.Marker({
      //     position: new AMap.LngLat(v[0], v[1]),
      //     content: markerContent(index),
      //     offset: new AMap.Pixel(-26, -52),
      //     draggable: false,
      //     title: "北京",
      //     label:{
      //       content:'',
      //     }
      //   });
      //   this.map.add(marker);
      // });

      this.map.on("complete", () => {
        this.$data.mapComplete = true;
        if (center && center.lng && center.lat) {
          this.initCenterPoint(center.lng, center.lat);
        }
        this.initMarkerPoint(allData);
      });
    },

    //销毁地图
    destroyMap() {
      this.centerPoint && this.map.remove(this.centerPoint);
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
    initMarkerPoint(allData) {
      // 点标记显示内容，HTML要素字符串
      var markerContent = (indexAll, index) => {
        return `<div class="custom-content-marker">
          <img src=${ICON_MARKER_POINT[indexAll]}>
        <div class="close-btn">${index == 0 ? "起" : index}</div>
        </div>`;
      };
      //鼠标移入点图标事件
      function showLabel(e){
        this.setLabel({
          content: '上海',
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
      allData.map((item, indexAll) => {
        item.map((v, index) => {
          let marker = new AMap.Marker({
            position: [v[0], v[1]],
            content: markerContent(indexAll, index),
            offset: new AMap.Pixel(-26, -52),
            draggable: false,
          });
          marker.on('mouseover', showLabel);
          marker.on('mouseout', showLabelOut);
          this.map.add(marker);
        });
      });
    },
    //绘制线路
    initLine(){
        let that = this
        let allData = [this.$data.allLocations, this.$data.allLocations2];
        allData.map((item,indexColor) => {
        item.map((v, index) => {
          AMap.plugin("AMap.Driving", function() {
            //异步同时加载多个插件
            var driving = new AMap.Driving({
              map: that.map,
              hideMarkers: true,
              outlineColor: "#fff"
            }); //驾车路线规划
            // driving.search(startLngLat, endLngLat, {
            //   waypoints: waypoints
            // });
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
</style>
