<template>
  <sub-menu class="b-c-fff" style="padding-top: 32px;">
    <el-row style="margin-bottom: 32px;">
      <el-col :span="12">
        <operating :getPageComponents="viewGetPageComponents" ref="Operating"/>
      </el-col>
      <el-col :span="12">
        <order-affirm :getPageComponents="viewGetPageComponents" ref="OrderAffirm"/>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 32px;">
      <el-col :span="12">
        <freight :getPageComponents="viewGetPageComponents" ref="Freight"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <item-common-des :getPageComponents="viewGetPageComponents" ref="ItemCommonDes"/>
      </el-col>
    </el-row>
  </sub-menu>
</template>

<script>
import { Row, Col } from 'element-ui';
import Operating from './Operating';
import ItemCommonDes from './ItemCommonDes';
import Freight from './Freight';
import OrderAffirm from './OrderAffirm';
import { Constant } from '@/util';
import mainMixin from '@/share/mixin/main.mixin';

export default {
  name: 'Main',
  mixins: [mainMixin],
  components: {
    'el-row': Row,
    'el-col': Col,
    'operating': Operating,
    'item-common-des': ItemCommonDes,
    'freight': Freight,
    'order-affirm': OrderAffirm
  },
  created(){
    let that = this;
    documentTitle("设置 - 区域运营配置");
  },
  data(){
    return{
      offsetHeight: Constant.OFFSET_BASE_HEIGHT,
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
