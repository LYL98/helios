<template>
  <el-select
    v-model="selectId"
    :size="size"
    :filterable="filterable"
    :clearable="clearable"
    :disabled="disabled"
    :placeholder="placeholder"
    style="width:100%;"
  >
    <el-option
      v-for="item in dataItem"
      :key="item.id"
      :label="item.realname + ' ' + item.phone"
      :value="item.id"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>

<script>
  import { Select, Option } from 'element-ui';
  import { Http, Config } from '@/util';

  export default {
    name: "select-driver",
    components: {
      'el-select': Select,
      'el-option': Option
    },
    props: {
      placeholder: { type: String, default: '请选择司机' },
      clearable: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      value: { type: Number | String, default: '' },
      size: { type: String, default: 'small' },
      filterable: { type: Boolean, default: true },
      deliveryDate: { type: String, default: '' },
      srcStorehouseId: { type: Number | String, default: '' },
      initCallBack:  { type: Function }, //获取数据时回调，方便外边控制
    },
    data() {
      return {
        dataItem: []
      };
    },
    model: {
      prop: 'value',
      event: 'ev'
    },
    created() {
      this.getData();
    },
    computed: {
      selectId: {
        get(){
          return this.value;
        },
        set(v){
          this.$emit('ev', v);
          let con = this.dataItem.filter(item => item.id === v);
          if(con.length > 0){
            this.$emit('change', con[0]);
          }
        }
      }
    },
    methods: {
      //获取数据
      async getData(){
        let res = await Http.get(Config.api.supDistributeAllocatedDrivers, {
          delivery_date: this.deliveryDate,
          src_storehouse_id: this.srcStorehouseId
        });
        if(res.code === 0){
          let rd = res.data;
          this.$data.dataItem = rd;
          this.$emit('initCallBack', rd);
        }else{
          this.$messageBox.alert(res.message, '提示');
        }
      },
    },
    watch: {
      deliveryDate: {
        deep: true,
        handler: function (a, b) {
          this.getData();
        }
      },
      srcStorehouseId: {
        deep: true,
        handler: function (a, b) {
          this.getData();
        }
      }
    }
  }
</script>

<style scoped>

</style>
