<template>
  <div style="min-width: 500px; min-height: 300px;" >
    <div id="amap"></div>
  </div>
</template>

<script>

  const MAP_STYLE_LIGHT = 'amap://styles/light';
  const MAP_STYLE_DARK = 'amap://styles/grey';
  const ICON_CENTER_POINT = require('./center.png');
  const ICON_MARKER_POINT = require('./marker.png');
  const ICON_PIN_POINT = require('./pin.webp');
  const ICON_PERSON_POINT = require('./icon_person.png');
  export default {
    name: "Location",
    props: {
      dark: { type: Boolean, default: false },
      zoom: { type: Number | String, default: 8 },
      showCenterIcon: { type: Boolean, default: true },
      marker: { type: Array, default: () => [] },
      center: { type: Object, default: () => ({ lng: '', lat: '' }) },
      person:{type: Array, default: () => []}
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
              this.$data.mapComplete && this.$props.showCenterIcon && this.initCenterPoint(next.lng, next.lat);
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
      this.initMap();
    },
    beforeDestroy() {
      this.destroyMap();
    },
    methods: {
      initMap() {
        let config = {
          zoom: Number(this.$props.zoom),
          isHotspot: false,
          scrollWheel: true,
          mapStyle: this.$props.dark ? MAP_STYLE_DARK: MAP_STYLE_LIGHT,
        };

        let center = this.$props.center;
        let person = this.$props.person;
        if (center && center.lng && center.lat) {
          config.center = [center.lng, center.lat];
        }

        this.map = new AMap.Map('amap', config);

        this.map.on('complete', () => {
          this.$data.mapComplete = true;
          if (center && center.lng && center.lat) {
            this.$props.showCenterIcon && this.initCenterPoint(center.lng, center.lat);
          }
          if(person && person.length > 0 ){
            this.initMarkerPerson(this.$props.person)
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
      //添加点图标
      initMarkerPoint(values) {
        const ICON = this.$props.dark ? ICON_PIN_POINT : ICON_MARKER_POINT;
        const OFFSET = this.$props.dark ? new AMap.Pixel(-10, -34) : new AMap.Pixel(-26, -52);
        values.forEach(v => {
          let marker = new AMap.Marker({
            position: new AMap.LngLat(v.lng, v.lat),
            icon: ICON,
            offset: OFFSET,
            draggable: false
          });
          this.map.add(marker);
        });
      },
    //添加交接员图标
      initMarkerPerson(values){
        values.forEach(v=>{
             let marker = new AMap.Marker({
            position: new AMap.LngLat(v.lng, v.lat),
            icon: ICON_PERSON_POINT,
            offset: new AMap.Pixel(-10, -34),
            draggable: false
          });
          this.map.add(marker);
        })
       
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
