<template>
  <el-form label-position="right" label-width="120px" size="mini">
    <el-form-area label-position="left" label="调拨信息">
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="调出仓：">
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="调入仓：">
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="销售日期：">
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="预计到货：">
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col} from "element-ui";
  import {FormArea} from '@/common';
  export default {
    name: "sup-stock-detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-form-area': FormArea,
    },
    props: {
      item: { type: Object, default: () => ({}) },
    },
  }
</script>

<style lang="scss" scoped>
  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>
