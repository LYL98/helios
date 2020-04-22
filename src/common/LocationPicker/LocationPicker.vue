<template>
  <div class="location-picker">
    <div :class="`selected${size === 'small' ? ' small' : ''}${isDisabled ? ' disabled' : ''}`" @click="toggleVisible">
      <span v-if="location && location.poi">{{ location.poi }}</span>
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
          @input="changeSearchwords"
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

  import { Input, Button, Autocomplete } from 'element-ui';

  const MAP_STYLE = 'amap://styles/light';
  const ICON_CENTER_POINT = require('./center-marker.png');

  const debounce = function (func, wait) {
    let timeout;

    return function () {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait);
    }
  };

  export default {
    name: "LocationPicker",
    components: {
      'el-input': Input,
      'el-autocomplete': Autocomplete,
      'el-button': Button
    },
    props: {
      location: { type: Object, default: () => ({
          lng: '',
          lat: '',
          province_title: '',
          city_title: '',
          poi: ''
        })
      },
      size: { type: String, default: '' },
      level: { type: String, default: 'city' }, // province | city
      disabled: { type: Boolean, default: false }
    },
    model: {
      prop: 'location',
      event: 'change'
    },
    computed: {
      isDisabled() {
        // 如果外部设置了disabled 属性，则直接禁用
        if (this.$props.disabled) return true;

        const { lng, lat, province_title, city_title  } = this.$props.location;
        if (lng && lat) return false;
        if (this.$props.level === 'city' && province_title && city_title) return false;
        if (this.$props.level === 'province' && province_title) return false;
        return true;
      }
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
      location: {
        deep: true,
        immediate: false,
        handler: function (next, prev) {
          this.$data.mapComplete && this.initLogic();
        }
      },
      // 输入搜索词时，执行搜索poi的逻辑
      keywords: {
        deep: true,
        immediate: true,
        handler: function(next, prev) {
          this.onSearch();
        }
      },
      // 切换选中项时，设置地图中心点位置
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
        if (this.isDisabled) return;
        this.$data.visible = !this.$data.visible;
      },
      initMap() {
        let config = {
          zoom: 16,
          isHotspot: false,
          scrollWheel: true,
          mapStyle: MAP_STYLE
        };

        const {location} = this.$props;
        if (location && location.lag && location.lat) {
          config.center = [location.lng, location.lat];
        }

        this.map = new AMap.Map('amap', config);
        this.map.on('complete', () => {
          this.$data.mapComplete = true;
          this.initLogic();
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

      // 初始化地图后执行的选点逻辑。
      initLogic() {

        const {province_title, city_title, lng, lat} = this.$props.location;
        // 如果中心点存在，则可以： 初始化地图、初始化中心点、根据中心点geo逆地理编码，再根据编码后的第一个地理位置获取poilist
        if (lng && lat) {

          this.map.setCenter([lng, lat]);
          this.initCenterPoint(lng, lat);
          this.geoCoder.getAddress(new AMap.LngLat(lng, lat), (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.$data.centerRegeo = result.regeocode;
              this.initKeywords();
            }
          });
          return;
        }

        // 如果存在省份、城市，则初始化地图、根据 省份 + 城市名称 获取 poilist
        if (this.$props.level === 'city' && province_title && city_title) {
          this.placeSearch.search(province_title + city_title, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.$data.poiList = result.poiList.pois || [];
              let poi = this.$data.poiList[0];
              this.map.setCenter([poi.location.lng, poi.location.lat]);
              this.initCenterPoint(poi.location.lng, poi.location.lat);
            }
          });
          return;
        }

        if (this.$props.level === 'province' && province_title) {
          this.placeSearch.search(province_title, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              this.$data.poiList = result.poiList.pois || [];
              let poi = this.$data.poiList[0];
              this.map.setCenter([poi.location.lng, poi.location.lat]);
              this.initCenterPoint(poi.location.lng, poi.location.lat);
            }
          });
        }
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

      // 根据中心点位置，逆地理位置编码
      onCenterRegeo({ lng, lat }) {
        if (!this.map) return;
        this.geoCoder.getAddress(new AMap.LngLat(lng, lat), (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.$data.centerRegeo = result.regeocode;
            this.initKeywords();
          }
        })
      },

      changeSearchwords(v) {

        if (!v) {
          this.initKeywords();
          return;
        }

        if (this.debounceInput) {
          this.debounceInput(v);
          return;
        }

        // 注册防抖函数
        this.debounceInput = debounce(function (value) {
          this.$data.keywords = value;
        }, 300);

      },

      initKeywords() {
        let {aois, formattedAddress} = this.$data.centerRegeo;
        this.$data.keywords = Array.isArray(aois) && aois.length > 0 ? aois[0].name : formattedAddress;
      },

      onSearch() {
        if (!this.placeSearch) return;
        let keywords = this.$data.keywords || '';
        const {province_title, city_title} = this.$props.location;
        if (this.$props.level === 'city' && keywords.indexOf(city_title) < 0) {
          keywords = city_title + keywords;
        }
        if (keywords.indexOf(province_title) < 0) {
          keywords = province_title + keywords;
        }
        this.placeSearch.search(keywords, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.$data.poiList = result.poiList.pois || [];
          }
        })
      },

      onClose() {
        this.$data.visible = false;
      },

      onSubmit() {
        let item = this.$data.selectedItem;

        this.$emit('change', {
          ...this.$props.location,
          lng: item.location.lng,
          lat: item.location.lat,
          poi: item.address
        });
        this.$data.visible = false;
      }
    }
  }
</script>

<style lang="scss">
  .input-keywords {
    .el-input__inner {
      border-color: #dcdfe6 !important;
    }
  }
</style>

<style lang="scss" scoped>

  .location-picker {
    display: inline-block;
    width: 100%;
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
    user-select: none;
    padding: 0 15px;
    border-radius: 4px;
    line-height: 40px;
    height: 40px;

    &.small {
      line-height: 32px;
      height: 32px;
    }

    &.disabled {
      background-color: #F5F7FA;
      border-color: #E4E7ED;
      cursor: not-allowed;
    }

    .placeholder {
      color: #B8BCC5;
    }

    &:not(.disabled):hover {
      border-color: #c0c4cc;
    }

    &:not(.disabled):active {
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
        line-height: 20px;
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
