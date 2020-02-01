<template>
  <div>
    <div v-if="supplierType === 'global_pur'">
      <p v-for="(item, index) in supplierBinds" :key="index">{{index + 1}}、{{item.supplier_title}}</p>
    </div>
    <div v-else-if="supplierType === 'local_pur'">
      <el-tabs>
        <el-tab-pane v-for="(item, index) in supplierBindsData" :key="index" :label="item.province_title">
          <p v-for="(s, i) in item.child" :key="i">
            {{i + 1}}、{{s.supplier_title}}
            <span v-if="s.is_main" class="main-span">主供应商</span>
          </p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { Tabs, TabPane } from 'element-ui';
  export default {
    name: "OtherItemSupplier",
    components: {
      'el-tabs': Tabs,
      'el-tab-pane': TabPane
    },
    props: {
      supplierType: { type: String, default: '' }, //global_pur 统采；local_pur 地采
      supplierBinds: { type: Array, default: [] }, //供应商列表
    },
    computed: {
      //处理后分省数据
      supplierBindsData() {
        let datas = [];
        this.supplierBinds.forEach(item => {
          if(datas.length === 0){
            datas.push({
              province_title: item.province_title,
              child: [item]
            });
          }else{
            for(let i = 0; i < datas.length; i++){
              if(datas[i].province_title === item.province_title){
                datas[i].child.push(item);
                break;
              }
              if(i === datas.length - 1){
                datas.push({
                  province_title: item.province_title,
                  child: [item]
                });
                break;
              }
            }
          }
        });
        return datas;
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .main-span{
    background: #ff5252;
    color: #fff;
    padding: 0 3px;
    border-radius: 3px;
    font-size: 12px;
    position: relative;
    top: -1px;
  }
</style>
