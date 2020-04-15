<template>
  <el-form label-position="right" label-width="120px" size="mini">
    <el-form-area label-position="left" label="调拨信息" style="position: relative;">
      <el-tag
        style="position: absolute; right: 0; top: 0;"
        size="small"
        :type="distribulte_plan_status_type[item.status]"
        disable-transitions
      >
        {{ distribulte_plan_status[item.status] }}
      </el-tag>
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
    <el-form-area class="mt-20" label-position="left" label="调拨商品" v-if="Array.isArray(item.p_items)">
      <el-table
        stripe
        :data="item.p_items"
      >
        <el-table-column prop="item_title" label="商品编号/名称">
          <template slot-scope="scope">
            {{ scope.row.item_code }} / {{ scope.row.item_title }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="调拨数量" width="140">
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
        <el-table-column prop="code" label="调拨单号" width="160"/>
        <el-table-column prop="creator" label="创建人" width="120">
          <template slot-scope="scope">
            {{ scope.row.creator && scope.row.creator.realname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" />
        <el-table-column prop="status" label="状态" width="140"/>
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
            {{logTypes[scope.row.category]}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            {{ returnRemark(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="操作人" width="140">
          <template slot-scope="scope">
            {{ scope.row.creator && scope.row.creator.realname || '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-form-area>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col, Table, TableColumn, Tag} from "element-ui";
  import {FormArea} from '@/common';
  import {Constant} from '@/util';
  export default {
    name: "distribute-plan-detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-form-area': FormArea,
      'el-tag': Tag,
      'el-table': Table,
      'el-table-column': TableColumn,
    },
    props: {
      item: { type: Object, default: () => ({}) },
    },
    data() {
      return {
        distribulte_plan_status: Constant.DISTRIBUTE_PLAN_STATUS(), // 调拨计划列表状态
        distribulte_plan_status_type: Constant.DISTRIBUTE_PLAN_STATUS_TYPE,
        logTypes: {
          add: '新增',
          edit: '修改',
          manual_add: '新增',
          audit_suc: '审核通过',
          audit_fail: '作废',
          close: '关闭'
        },
      }
    },
    methods: {
      returnRemark(data){
        if(data.remark) return data.remark;
        if((data.category ==='audit_suc' || data.category ==='audit_fail') && data.after && data.after.audit_remark) return data.after.audit_remark;
        if(data.category ==='close' && data.after && data.after.close_remark) return data.after.close_remark;
        return '';
      }
    }
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
