<template>
  <div style="min-width: 500px; height: 500px">
    <div id="amap"></div>
  </div>
</template>

<script>

  const MAP_STYLE = 'amap://styles/light';
  const ICON_CENTER_POINT = require('./center-marker.png');

  export default {
    name: "Location",
    props: {
      center: { type: Object, default() { return { lng: 114.061866, lat: 22.632913 } } }
    },
    data() {
      return {
        mapComplete: false,
      }
    },
    watch: {
      center: {
        deep: true,
        immediate: false,
        handler: function (next, pre) {
          if (next && next.lng && next.lat) {
            if (this.map) {
              this.map.setCenter([next.lng, next.lat]);
              this.$data.mapComplete && this.initCenterPoint(next.lng, next.lat);
            }
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
      initMap() {
        let config = {
          zoom: 8,
          isHotspot: false,
          scrollWheel: true,
          mapStyle: MAP_STYLE
        };

        let center = this.$props.center;
        if (center && center.lng && center.lat) {
          config.center = [center.lng, center.lat];
        }

        this.map = new AMap.Map('amap', config);

        this.map.on('complete', () => {
          this.$data.mapComplete = true;
          if (center && center.lng && center.lat) {
            this.initCenterPoint(center.lng, center.lat);
          }
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
          offset: new AMap.Pixel(-16, -38),
          draggable: false
        });

        this.centerPoint = marker;
        this.map.add(marker);
      },

    }
  }
</script>

<style lang="scss" scoped>

  #amap {
    width: 100%;
    height: 100%;
  }

</style>
