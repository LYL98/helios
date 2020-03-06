<template>
  <div class="pb-20">
    <el-row>
      <el-col :span="6" class="text-right">职务：</el-col>
      <el-col :span="18">{{ deliver_post[item.post] }}</el-col>
    </el-row>
    <el-row class="mt-20">
      <el-col :span="6" class="text-right">姓名：</el-col>
      <el-col :span="18">{{ item.realname }}</el-col>
    </el-row>
    <el-row class="mt-20" v-if="item.post === 'deliver'">
      <el-col :span="6" class="text-right">车牌：</el-col>
      <el-col :span="18">{{ item.driver_car_num }}</el-col>
    </el-row>
    <el-row class="mt-20" v-if="item.post === 'deliver'">
      <el-col :span="6" class="text-right">车型：</el-col>
      <el-col :span="18">{{ item.driver_car_type }}</el-col>
    </el-row>
    <el-row class="mt-20">
      <el-col :span="6" class="text-right">账号手机号：</el-col>
      <el-col :span="18">{{ item.phone }}</el-col>
    </el-row>
    <el-row class="mt-20">
      <el-col :span="6" class="text-right">创建人：</el-col>
      <el-col :span="18">{{ (item.creator && item.creator.realname) || '-' }}</el-col>
    </el-row>
    <el-row class="mt-20">
      <el-col :span="6" class="text-right">创建时间：</el-col>
      <el-col :span="18">{{ item.created }}</el-col>
    </el-row>
  </div>
</template>

<script>
  import { Row, Col } from 'element-ui';
  import { Constant } from '@/util';
  export default {
    name: 'deliver-detail',
    components: {
      'el-row': Row,
      'el-col': Col,
    },
    props: {
      item: { type: Object, default: {} },
    },
    data() {
      return {
        deliver_post: Constant.DELIVER_POST(),
      };
    },
  };
</script>

<style scoped>
  .mt-20 {
    margin-top: 20px;
  }
  .pb-20 {
    padding-bottom: 20px;
  }
  .text-right {
    padding-right: 20px;
    text-align: right;
  }
</style>
