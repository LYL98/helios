<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province type="select" isRequired @change="selectProvince"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div v-if="provinceCode !== ''" class="b-c-fff" style="padding-top: 20px;">
      <el-row style="margin-bottom: 32px;">
        <el-col :span="12">
          <operating :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="Operating"/>
        </el-col>
        <el-col :span="12">
          <order-affirm :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="OrderAffirm"/>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 32px;">
        <el-col :span="12">
          <freight :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="Freight"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <item-common-des :getPageComponents="viewGetPageComponents" :provinceCode="provinceCode" ref="ItemCommonDes"/>
        </el-col>
      </el-row>
    </div>
  </sub-menu>
</template>

<script>
import { Row, Col } from 'element-ui';
import Operating from './Operating';
import ItemCommonDes from './ItemCommonDes';
import Freight from './Freight';
import OrderAffirm from './OrderAffirm';
import { GlobalProvince } from '@/component';
import mainMixin from '@/share/mixin/main.mixin';
import { QueryItem } from '@/common';

export default {
  name: 'Main',
  mixins: [mainMixin],
  components: {
    'el-row': Row,
    'el-col': Col,
    'operating': Operating,
    'item-common-des': ItemCommonDes,
    'freight': Freight,
    'order-affirm': OrderAffirm,
    'global-province': GlobalProvince,
    'my-query-item': QueryItem,
  },
  data(){
    return {
      provinceCode: ''
    }
  },
  created(){
    documentTitle("设置 - 区域运营配置");
  },
  methods: {
    //选择区域后
    selectProvince(data){
      if(this.provinceCode !== ''){
        this.$data.provinceCode = data.code;
        this.$nextTick(()=>{
          let pc = this.viewGetPageComponents('Operating');
          if(pc) pc.basicdataOrderTimeGet();

          pc = this.viewGetPageComponents('OrderAffirm');
          if(pc) pc.basicdataConfirmTime();

          pc = this.viewGetPageComponents('Freight');
          if(pc) pc.basicdataDeliveryInfoGet();

          pc = this.viewGetPageComponents('ItemCommonDes');
          if(pc) pc.getItemCommon();
        });
      }else{
        this.$data.provinceCode = data.code;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .top{
    overflow: hidden;
    >.setting-item{
      float: left;
      width: 420px;
      margin-right: 20px;
    }
  }
</style>
