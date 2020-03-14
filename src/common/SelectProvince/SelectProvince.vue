<template>
  <el-select v-model="editValue" filterable placeholder="请选择" :disabled="disabled" :size="size" :clearable="clearable" style="width:100%;">
    <el-option v-if="nationwide" key="nationwide" value="nationwide" label="全国"/>
    <el-option v-for="item in dataItem" :key="item.code" :label="item.title" :value="item.code"/>
  </el-select>
</template>

<script>
  import { Select, Option, MessageBox } from 'element-ui';
  import { Http, Config } from '@/util';

  export default {
    name: "SelectProvince",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    props: {
      value: { type: [String, Number], default: '' },
      disabled: { type: Boolean, default: false },
      clearable: {type: Boolean, default: false},
      size: { type: String, default: '' },
      nationwide: { type: Boolean, default: false }, //是否显示全国
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
      editValue: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.$emit('change', v);
        }
      }
    },
    created() {
      this.baseProvinceList();
    },
    methods: {
      //获取所有省
      async baseProvinceList(){
        let res = await Http.get(Config.api.baseProvinceList, {});
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
          //如果只有一个省，默认选择，页面不显示
          if(rd.length === 1){
            this.editValue = rd[0].code;
            // that.changeProvince(rd[0].code, true);
          }
        }else{
          MessageBox.alert(res.message, '提示');
        }
      }

    }

  }
</script>

<style scoped>

</style>
