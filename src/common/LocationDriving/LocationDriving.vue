<template>
  <div style="min-width: 500px; min-height: 300px;">
    <div id="amap"></div>
  </div>
</template>

<script>
const MAP_STYLE = "amap://styles/light";
const ICON_CENTER_POINT = require("./center.png");
const ICON_MARKER_POINT = require("./marker.png");

export default {
  name: "LocationDriving",
  props: {
    marker: { type: Array, default: () => [] },
    center: { type: Object, default: () => ({ lng: "", lat: "" }) }
  },
  data() {
    return {
      mapComplete: false
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
    console.log(this.$props.center);
    console.log(this.$props.marker);

    this.initMap();
  },
  beforeDestroy() {
    this.destroyMap();
  },
  methods: {
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
      var startLngLat = [116.379028, 39.865042];
      var endLngLat = [116.427281, 39.903719];
      var waypoints = [
        [116.379028, 39.885042],
        [116.379028, 34.885042]
      ];
      AMap.plugin("AMap.Driving", function() {
        //异步同时加载多个插件
        var driving = new AMap.Driving({
          map: that.map,
          hideMarkers: true
        }); //驾车路线规划
        driving.search(startLngLat, endLngLat, {
          waypoints: waypoints
        });
      });

      // 点标记显示内容，HTML要素字符串
      var markerContent =
        `<div class="custom-content-marker">
          <img src=${ICON_MARKER_POINT}>
        <div class="close-btn">1</div>
        </div>`

      waypoints.forEach(v => {
        let marker = new AMap.Marker({
          position: new AMap.LngLat(v[0], v[1]),
          icon: markerContent,
          offset: new AMap.Pixel(-26, -52),
          draggable: false,
          title: "北京"
        });
        this.map.add(marker);
      });

      this.map.on("complete", () => {
        this.$data.mapComplete = true;
        if (center && center.lng && center.lat) {
          this.initCenterPoint(center.lng, center.lat);
        }
        this.initMarkerPoint(this.$props.marker);
      });
    },
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

    initMarkerPoint(values) {
      values.forEach(v => {
        let marker = new AMap.Marker({
          position: new AMap.LngLat(v.lng, v.lat),
          icon: ICON_MARKER_POINT,
          offset: new AMap.Pixel(-26, -52),
          draggable: false
        });
        this.map.add(marker);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#amap {
  width: 100%;
  height: 100%;
  .custom-content-marker {
    position: relative;
    width: 38px;
    height: 38px;
  }
}
.custom-content-marker img {
  width: 100%;
  height: 100%;
}
.custom-content-marker .close-btn {
  position: absolute;
  font-size: 12px;
  color: #000;
}
</style>
