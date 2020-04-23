<template>
  <div style="min-width: 500px; height: 500px; margin: -30px -20px">
    <div id="amap"></div>
  </div>
</template>

<script>

  const MAP_STYLE = 'amap://styles/light';
  const ICON_CENTER_POINT = require('./center.png');
  const ICON_MARKER_POINT = require('./marker.png');

  export default {
    name: "Location",
    props: {
      marker: { type: Array, default: () => [] },
      center: { type: Object, default: () => ({ lng: '', lat: '' }) }
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
      },
      marker: {
        deep: true,
        immediate: false,
        handler: function (next, pre) {
          if (this.map) {
            this.$data.mapComplete && this.initMarkerPoint(next);
          }
        }
      },
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
        if (center && center.lng && center.lat) {
          config.center = [center.lng, center.lat];
        }

        this.map = new AMap.Map('amap', config);

        this.map.on('complete', () => {
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
  }
</script>

<style lang="scss" scoped>

  #amap {
    width: 100%;
    height: 100%;
  }

</style>
