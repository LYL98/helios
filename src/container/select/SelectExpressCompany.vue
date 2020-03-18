<template>
  <el-select
    v-model="selectedShipCode"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width:100%;"
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
    // props: ['value', 'size', 'provinceCode', 'zoneId' , 'filterable', 'clearable', 'placeholder', 'disabled'],
    props: {
      showAll: { type: Boolean, default: false },
      value: { type: String | Number },
      size: { type: String, default: '' },
      filterable: { type: Boolean, default: true },
      clearable: { type: Boolean, default: true},
      placeholder: { type: String, default: '县域' },
      disabled: { type: Boolean, default: false }
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
    created() {
      this.baseOrderShipList();
    },
    computed: {
      //县市改变
      selectedShipCode: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    methods: {
      //根据传进来的区域code 获取城市列表
      async baseOrderShipList(){
        let res = await Http.get(Config.api.baseOrderShipList, {});

        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
    }
  }
</script>

<style scoped>

</style>
