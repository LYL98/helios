<template>
  <el-form label-position="right" label-width="120px" size="mini">
    <!--  表示采购品控  -->
    <el-form-area label-position="left" label="采购信息" v-if="item.out_type === 'pur'">
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="商品编号/名称：">
            {{ item.item_code }} / {{ item.item_title }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="采购单号：">
            {{ item.relate_order.code }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="采购日期：">
            {{ item.relate_order.order_date }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="预计到货：">
            {{ item.relate_order.estimate_arrive_at }}
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
          <el-form-item label="采购数量：">
            {{ item.num }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="送达仓：">
            {{ item.relate_order.storehouse.title }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>
    <el-form-area label-position="left" label="品控信息" v-if="item.out_type === 'pur'">
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="到货数量：">
            {{ item.num_arrive }}件
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="品控数量：">
            {{ item.qa_num }}件
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="合格数量：">
            {{ item.num_arrive - item.un_qa_num }}件
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="保质期：">
            {{ item.shelf_life }}天
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="库存期：">
            {{ item.stock_life }}天
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="备注：">
            {{ item.remark }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="品控人：">
            {{ item.creator.realname}}件
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="品控时间：">
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
    name: "sup-accept-detail",
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
