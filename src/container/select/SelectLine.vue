<template>
  <el-select
    v-model="selectedLineCode"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :placeholder="placeholder"
    style="width: 100%;"
    :disabled="disabled">
    <el-option
      v-for="item in listItem"
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
    name: "SelectLine",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    props: {
      size: { type: String, default: '' },
      filterable: { type: Boolean, default: true },
      clearable: { type: Boolean, default: true },
      placeholder: { type: String, default: '选择线路' },
      disabled: { type: Boolean, default: false },
      provinceCode: { type: String | Number, required: true },
      lineId: { type: String | Number, required: true },
      initCallBack:  { type: Function }, //获取数据时回调，方便外边控制
    },
    model: {
      prop: 'lineId',
      event: 'change'
    },
    computed: {
      selectedLineCode: {
        get() {
          return this.$props.lineId;
        },
        set(v) {
          this.$emit('change', v)
        }
      }
    },
    data() {
      return {
        listItem: []
      }
    },
    created() {
      // 组件创建，加载线路列表
      this.baseLineList();
    },
    methods: {
      // 获取所有线路的列表
      async baseLineList(){
        try {
          let res = await Http.get(Config.api.baseLineList, {
            province_code: this.$props.provinceCode
          });
          if(res.code === 0){
            let rd = res.data;
            this.$data.listItem = rd;
            this.$emit('initCallBack', rd);
          }else{
            MessageBox.alert(res.message, '提示');
          }
        } catch (e) {
          // console.log('e.message:', e.message);
        }
      },
    }
  }
</script>

<style scoped>

</style>
