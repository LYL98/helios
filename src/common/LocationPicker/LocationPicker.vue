<template>
  <div class="location-picker">
    <div class="selected" @click="toggleVisible">
      <span v-if="selectedItem && selectedItem.address">{{ selectedItem.address }}</span>
      <span class="placeholder" v-else>请选择地址</span>
      <i class="el-icon-location"></i>
    </div>

    <div class="location-container" v-show="visible">
      <nav class="navbar">
        <div class="action">
          <span @click="onClose">关闭</span>
          <span @click="onSubmit">选择好了</span>
        </div>

        <el-input
          class="input-keywords"
          v-model="searchwords"
          prefix-icon="el-icon-search"
          placeholder="请输入搜索词..."
          size="small"
          style="width: 500px;"
          clearable
          @change="changeSearchwords"
        ></el-input>
      </nav>
      <div class="content">
        <ul class="poi-list">
          <li
            v-for="(item, index) in poiList"
            :key="index"
            :class="item.id === selectedItem.id ? 'active' : ''"
            @click="selectedItem=item"
          >
            <span class="font-size-13 font-weight-bold">{{item.name}}</span>
            <span class="font-size-12">{{ item.pname }}{{ item.cityname }}{{ item.adname }}{{ item.address }}</span>
          </li>
        </ul>
        <div class="amap-container">
          <div id="amap"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { Input, Button } from 'element-ui';

  const MAP_STYLE = 'amap://styles/light';
  const ICON_CENTER_POINT = require('./center-marker.png');

  export default {
    name: "LocationPicker",
    components: {
      'el-input': Input,
      'el-button': Button
    },
    props: {
      province: { type: String, default: '' },
      city: { type: String, default: '' },
      address: { type: String, default: '' },
      geo: { type: Object, default() { return { lng: 114.061866, lat: 22.632913 } } }
    },
    data() {
      return {
        visible: false,
        mapComplete: false,
        centerRegeo: {},
        searchwords: '',
        keywords: '',

        selectedItem: {},

        poiList: [],
      }
    },
    watch: {
      keywords: {
        deep: true,
        immediate: true,
        handler: function(next, prev) {
          this.onSearch();
        }
      },
      selectedItem: {
        deep: true,
        immediate: false,
        handler: function (next, pre) {
          if (next && next.location && next.location.lng && next.location.lat) {
            if (this.map) {
              this.map.setCenter([next.location.lng, next.location.lat]);
              this.$data.mapComplete && this.initCenterPoint(next.location.lng, next.location.lat);
            }
          }
        }
      }
    },
    created() {
      this.geoCoder = new AMap.Geocoder({
        city: '全国',
        radius: 2000,
        batch: false,
        extensions: 'all'
      });
      this.placeSearch = new AMap.PlaceSearch({
        // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
        city: '全国',
        citylimit: true,
        extensions: 'all',
        pageSize: 30
      });
    },
    mounted() {
      this.initMap();
    },
    beforeDestroy() {
      this.destroyMap();
    },
    methods: {
      toggleVisible() {
        this.$data.visible = !this.$data.visible;
      },
      initMap() {
        let config = {
          zoom: 16,
          isHotspot: false,
          scrollWheel: true,
          mapStyle: MAP_STYLE
        };

        let center = this.$props.geo;
        if (center && center.lng && center.lat) {
          config.center = [center.lng, center.lat];
          this.map = new AMap.Map('amap', config);
          this.onCenterRegeo(center);
        } else {
          this.map = new AMap.Map('amap', config);
        }

        this.map.on('complete', () => {
          this.$data.mapComplete = true;
          if (center && center.lng && center.lat) {
            this.initCenterPoint(center.lng, center.lat);
          }
        });
      },
      destroyMap() {
        if (this.centerPoint) {
          (this.centerPoint.getExtData().listeners || []).forEach(listener => {
            AMap.event.removeListener(listener);
          });
          this.centerPoint.setExtData({ listeners: [] });
        }
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
          draggable: true
        });

        let listeners = [];

        listeners.push(
          AMap.event.addListener(marker, 'dragend', (e) => {
            this.map.setCenter(e.lnglat);
            this.onCenterRegeo(e.lnglat);
          })
        );
        marker.setExtData({ listeners: listeners });
        this.centerPoint = marker;
        this.map.add(marker);
      },

      onCenterRegeo({ lng, lat }) {
        if (!this.map) return;
        this.geoCoder.getAddress(new AMap.LngLat(lng, lat), (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            console.log("result.regeocode: ", result.regeocode);
            this.$data.centerRegeo = result.regeocode;
            this.initKeywords();
          }
        })
      },

      changeSearchwords(v) {
        if (v) {
          this.$data.keywords = v;
        } else {
          this.initKeywords();
        }
      },

      initKeywords() {
        let {aois, formattedAddress} = this.$data.centerRegeo;
        this.$data.keywords = Array.isArray(aois) && aois.length > 0 ? aois[0].name : formattedAddress;
      },

      onSearch() {
        if (!this.placeSearch) return;
        this.placeSearch.search(this.$data.keywords, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.$data.poiList = result.poiList.pois || [];
          }
        })
      },

      onClose() {
        this.$data.visible = false;
      },

      onSubmit() {
        this.$emit('change', this.$data.selectedItem);
        this.$data.visible = false;
      }
    }
  }
</script>

<style lang="scss" scoped>

  .location-picker {
    display: inline-block;
    width: 500px;
  }

  .location-picker .selected {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: left;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .3s;
    font-weight: 500;
    user-select: none;
    line-height: 32px;
    height: 32px;
    padding: 0 15px;
    font-size: 13px;
    line-height: 1;
    border-radius: 4px;

    .placeholder {
      color: #B8BCC5;
    }

    &:hover {
      border-color: #c0c4cc;
    }

    &:active {
      border-color: #409eff;
    }
  }

  .location-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    background-color: #5A5D64;
  }

  .location-container .navbar {
    height: 56px;
    overflow: hidden;
    zoom: 1;
    border-bottom: 1px solid #d6dfea;
    background: #eff4fa;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0 100px;
    min-width: 800px;

    .action {
      font-size: 13px;
      color: #5A5D64; // 8c939d
      transition: color .3s ease-in-out;
      cursor: pointer;
      position: absolute;
      left: 20px;

      span {
        display: inline-block;
        line-height: 56px;
        padding: 0 20px;
        user-select: none;

        &:hover {
          font-weight: 600;
          background-color: #faf8f5;
        }
      }


      span:hover {
        font-weight: 600;
      }
    }

  }

  .location-container .content {
    display: flex;
    height: 100%;

    .poi-list {
      min-width: 300px;
      width: 300px;
      list-style: none;
      padding-left: 0;
      background-color: #faf8f5;
      box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
      border-right: 1px solid #d3d5d5;
      cursor: pointer;
      overflow-y: auto;
      overflow-y: overlay;

      li {
        height: 40px;
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        transition: background-color .2s ease;

        &:hover,
        &.active {
          background-color: lighten(#d3d5d5, 10);
        }

        span {
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .location-container .content .amap-container {
    flex-grow: 1;

    #amap {
      width: 100%;
      height: 100%;
    }
  }

  .font-size-13 {
    font-size: 13px;
  }

  .font-size-12 {
    font-size: 12px;
  }

  .font-weight-bold {
    font-weight: bold;
  }
</style>
