<template>
  <el-select
    v-model="selectedCityCode"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    :class="isUseToQuery ? 'query-item-select' : 'default'"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
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
  import { Select, Option, MessageBox } from 'element-ui';
  import { Http, Config } from '@/util';

  export default {
    name: "SelectCity",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    // props: ['value', 'size', 'provinceCode', 'zoneCode' , 'filterable', 'clearable', 'placeholder', 'disabled'],
    props: {
      showAll: { type: Boolean, default: false },
      value: { type: String | Number },
      size: { type: String, default: '' },
      provinceCode: { type: String | Number },
      zoneCode: { type: String | Number },
      filterable: { type: Boolean, default: true },
      clearable: { type: Boolean, default: true},
      placeholder: { type: String, default: '所在仓' },
      disabled: { type: Boolean, default: false },
      isUseToQuery: {type: Boolean, default: false}
    },
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
          MessageBox.alert(res.message, '提示');
        }
      },
    }
  }
</script>

<style scoped>
  .default{
    width: 100%;
  }
</style>
