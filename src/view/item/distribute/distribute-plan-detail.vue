<template>
  <el-form label-position="right" label-width="120px" size="mini">
    <el-form-area label-position="left" label="调拨信息">
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="调出仓：">
            {{ item.src_storehouse && item.src_storehouse.title || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="调入仓：">
            {{ item.tar_storehouse && item.tar_storehouse.title || '-' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="销售日期：">
            {{ item.available_date || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="预计到货：">
            {{ item.estimate_arrive_at || '-' }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>
    <el-form-area class="mt-20" label-position="left" label="调拨商品" v-if="Array.isArray(item.plan_details)">
      <el-table
        stripe
        :data="item.plan_details"
      >
        <el-table-column prop="item_title" label="商品编号/名称" />
        <el-table-column prop="num" label="调拨数量" width="180" >
          <template slot-scope="scope">
            <span v-if="!!scope.row.num">{{scope.row.num}}件</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form-area>
    <el-form-area class="mt-20" label-position="left" label="关联调拨单" v-if="Array.isArray(item.distributes)">
      <el-table
        stripe
        :data="item.distributes"
        empty-text="暂无关联的调拨单"
      >
        <el-table-column prop="item_title" label="调拨单号" width="160"/>
        <el-table-column prop="creator" label="创建人" width="120"/>
        <el-table-column prop="created" label="创建时间" />
        <el-table-column prop="status" label="状态" width="120"/>
      </el-table>
    </el-form-area>
    <el-form-area class="mt-20" label-position="left" label="操作时间" v-if="Array.isArray(item.logs)">
      <el-table
        stripe
        :data="item.logs"
      >
        <el-table-column prop="created" label="时间" width="160"/>
        <el-table-column prop="category" label="操作内容" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.category === 'add'">新增</span>
            <span v-else-if="scope.row.category === 'audit'">审核通过</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="creator" label="操作人" width="120">
          <template slot-scope="scope">
            {{ scope.row.creator && scope.row.creator.realname || '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-form-area>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col, Table, TableColumn} from "element-ui";
  import {FormArea} from '@/common';
  export default {
    name: "distribute-plan-detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-form-area': FormArea,
      'el-table': Table,
      'el-table-column': TableColumn,
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
