<template>
  <el-select
    v-model="selectedCityId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width: 100%;"
  >
    <el-option v-if="showAll" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.title"
      :value="item.id">
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
    // props: ['value', 'size', 'provinceCode', 'zoneId' , 'filterable', 'clearable', 'placeholder', 'disabled'],
    props: {
      showAll: { type: Boolean, default: false },
      value: { type: String | Number },
      size: { type: String, default: '' },
      provinceCode: { type: String | Number },
      zoneId: { type: String | Number },
      filterable: { type: Boolean, default: true },
      clearable: { type: Boolean, default: true},
      placeholder: { type: String, default: '县域' },
      disabled: { type: Boolean, default: false },
      showAll: {type: Boolean, default: false},
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
      selectedCityId: {
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
          // 如果区域code 为 空 或者 零，则返回.
          if (!next) {
            return;
          }
          this.baseCityList();
        }
      },

      zoneId: {
        deep: true,
        immediate: true,
        handler: function (next, pre) {
          // 如果区域code 为 空 或者 零，则返回.
          if (typeof next === 'undefined') {
            return;
          }
          this.baseCityList();
        }
      },

    },
    methods: {
      //根据传进来的区域code 获取城市列表
      async baseCityList(){
        let res = await Http.get(Config.api.baseCityList, {
          province_code: this.$props.provinceCode || '',
          zone_id: this.$props.zoneId || ''
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
</style>
