<template>
  <el-select
    filterable
    :clearable="clearable"
    v-model="selectedCityId"
    :disabled="disabled"
    :placeholder="placeholder || '请选择县域'"
    :size="size"
    @change="onChange"
    style="width: 100%;"
  >
    <el-option v-if="typeof showAll !== 'undefined'" key="" label="全部" value="">
    </el-option>
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.title"
      :value="item.id"
      @click.native="handleSelectItem(item)"
    >
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
    props: ['value', 'provinceCode', 'zoneId' ,'showAll', 'clearable', 'placeholder', 'disabled', 'size'],
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
          this.baseCityList();
        }
      },
    },
    methods: {
      onChange(cityId) {
        let cityName = '';
        for (let i = 0; i < this.dataItem.length; i++) {
          let item = this.dataItem[i];
          if (item.id === cityId) {
            cityName = item.title;
            break;
          }
        }
        // console.log('cityId: ', cityId, ', ', cityName);
        this.$emit('changeCityName', cityName);
      },
      handleSelectItem(item) {
        console.log('item: ', item);
        this.$emit('select-item', item);
      },
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
          this.$messageBox.alert(res.message, '提示');
        }
      },
    }
  }
</script>

<style scoped>
</style>
