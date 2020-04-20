<template>
  <el-form label-position="right" label-width="120px" size="mini">
    <el-form-area label-position="left" label="调拨信息">
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="商品编号/名称：">
            {{ item.p_item.code }} / {{ item.p_item.title }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="批次：">
            {{ item.batch_code }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="供应商：">
            {{ item.supplier_title }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="商品过期时间：">
            {{ item.due_date }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="库存过期时间：">
            {{ item.stock_due_date }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="库存数量：">
            {{ item.num }}件
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="入场人：">
            {{ item.creator && item.creator.realname || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="入场时间：">
            {{ item.created }}
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
      item: {type: Object, default: () => ({})},
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
