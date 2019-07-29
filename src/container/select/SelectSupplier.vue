<template>
  <el-select
    v-model="selectedSupplierId"
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
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  import { Select, Option, MessageBox } from 'element-ui';
  import { Http, Config } from '@/util';

  export default {
    name: "SelectSupplier",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    // props: ['value', 'size', 'provinceCode', 'zoneCode' , 'filterable', 'clearable', 'placeholder', 'disabled'],
    props: {
      showAll: { type: Boolean, default: false },
      value: { type: String | Number },
      provinceCode: { type: String | Number },
      size: { type: String, default: '' },
      filterable: { type: Boolean, default: true },
      clearable: { type: Boolean, default: true},
      placeholder: { type: String, default: '请选择供应商' },
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
    computed: {
      //县市改变
      selectedSupplierId: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    created() {
      this.baseSupplierListSelect();
    },
    methods: {
      //根据传进来的省份code 获取城市列表
      async baseSupplierListSelect(){
        let res = await Http.get(Config.api.baseSupplierListSelect, {
          province_code: this.$props.provinceCode || '',
          condition: '',
          is_check: 1, // 是否审核通过？ 0 否 1 是 null 全部
          is_freeze: 0 // 是否赠品？ 0 否 1 是 null 全部
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
