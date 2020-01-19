<template>
  <el-cascader
    :options="dataTree"
    :size="size"
    style="width: 100%"
    :clearable="clearable"
    :props="dataProps"
    @change="handleChange"
    :placeholder="placeholder"
    v-model="selectIds"
  ></el-cascader>
</template>

<script>
import { MessageBox, Cascader } from 'element-ui';
import { Http, Config } from '@/util';
import cascaderMixin from './cascader.mixin';

export default {
  name: "CascaderWarehouseTray",
  mixins: [cascaderMixin],
  components: {
    'el-cascader': Cascader
  },
  created(){
  },
  props: {
    placeholder: { type: String, default: '请选择仓/库/托盘' },
    isAuth: { type: Boolean, default: false }, //是否要求权限(仓)
    storehouseId: { type: Number | String, default: '' }
  },
  data() {
    let that = this;
    return {
      dataProps: {
        value: 'id',
        label: 'title',
        children: 'children',
        lazy: true,
        lazyLoad (node, resolve) {
          that.getData(node, resolve, (data)=>{
            const nodes = data.map(item => ({
              id: item.id,
              title: item.title,
              leaf: node.level >= 2
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        }
      },
      dataTree: []
    };
  },
  methods: {
    //获取仓列表
    getData(node, resolve, callback){
      if(node){
        if(node.level === 1){
          this.baseWarehouseList(node.value, callback);
        }else if(node.level === 2){
          this.baseWareTrayList(node.path[0], node.value, callback);
        }
      }else{
        this.baseStorehouseList(callback);
      }
    },
    //获取仓列表
    async baseStorehouseList(callback){
      let res = await Http.get(this.isAuth ? Config.api.baseSupStorehouseList : Config.api.baseStorehouseList, {
        need_num: 50,
        id: this.storehouseId
      });
      if(res.code === 0){
        this.$data.dataTree = res.data;
        //typeof callback === 'function' && callback(res.data);
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
    //获取库列表
    async baseWarehouseList(storehouseId, callback){
      let res = await Http.get(Config.api.baseWarehouseList, {storehouse_id: storehouseId, need_num: 50});
      if(res.code === 0){
        typeof callback === 'function' && callback(res.data);
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
    //获取临库、托盘列表
    async baseWareTrayList(storehouseId, warehouseId, callback){
      let res = await Http.get(Config.api.baseWareTrayList, {storehouse_id: storehouseId, warehouse_id: warehouseId, need_num: 1000});
      if(res.code === 0){
        typeof callback === 'function' && callback(res.data);
      }else{
        this.$messageBox.alert(res.message, '提示');
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
