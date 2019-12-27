<template>
  <el-select
    filterable
    :clearable="clearable"
    v-model="selectedCityCode"
    :disabled="disabled"
    :placeholder="placeholder || '请选择所在仓'"
    :size="size"
    @change="onChange"
    style="width: 100%;"
  >
    <el-option v-if="typeof showAll !== 'undefined'" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.code"
      :label="item.title"
      :value="item.code">
    </el-option>
  </el-select>
</template>

<script>
  import { Select, Option } from 'element-ui';
  import { Http, Config } from '@/util';

  export default {
    name: "SelectCityRefactor",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    props: ['value', 'provinceCode', 'zoneCode' ,'showAll', 'clearable', 'placeholder', 'disabled', 'size'],
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        dataItem: []
      }
    },
    computed: {
      //县市改变
      selectedCityCode: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    watch: {
      provinceCode: {
        deep: true,
        immediate: true,
        handler: function (next, pre) {
          // 如果省份code 为 空 或者 零，则返回.
          if (!next) {
            return;
          }
          this.baseCityList();
        }
      },
      zoneCode: {
        deep: true,
        immediate: true,
        handler: function (next, pre) {
          this.baseCityList();
        }
      },
    },
    methods: {
      onChange(cityCode) {
        let cityName = '';
        for (let i = 0; i < this.dataItem.length; i++) {
          let item = this.dataItem[i];
          if (item.code === cityCode) {
            cityName = item.title;
            break;
          }
        }
        // console.log('cityCode: ', cityCode, ', ', cityName);
        this.$emit('changeCityName', cityName);
      },
      //根据传进来的省份code 获取城市列表
      async baseCityList(){
        let res = await Http.get(Config.api.baseCityList, {
          province_code: this.$props.provinceCode || '',
          zone_code: this.$props.zoneCode || ''
        });
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    }
  }
</script>

<style scoped>
</style>
