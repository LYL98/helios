<template>
  <el-form label-position="right" label-width="120px" size="mini">
    <el-form-area label-position="left" label="调拨信息" style="position: relative;">
      <el-tag
        style="position: absolute; right: 0; top: 0;"
        size="small"
        :type="distribulte_waybill_status_type[item.status]"
        disable-transitions
      >
        {{ distribulte_waybill_status[item.status] }}
      </el-tag>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="调拨计划单：">
            {{ item.plan_code || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="调拨单：">
            {{ item.code || '-' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="调出仓：">
            {{ item.src_storehouse_title || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="调入仓：">
            {{ item.tar_storehouse_title || '-' }}
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
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="司机姓名：">
            {{ item.driver && item.driver.realname || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="手机号：">
            {{ item.driver && item.driver.phone || '-' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="车牌号：">
            {{ item.driver && item.driver.driver_car_num || '-' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="10">
          <el-form-item label="车型：">
            {{ item.driver && item.driver.driver_car_type || '-' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item label="费用：">
            <span v-if="!!item.fee">
              ¥{{ DataHandle.returnPrice(item.fee) }}
            </span>
            <span v-else>-</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>
    <el-form-area class="mt-20" label-position="left" label="调拨商品" v-if="Array.isArray(item.distributes)">
      <el-table
        stripe
        :data="item.distributes"
      >
        <el-table-column prop="item_title" label="商品编号/名称">
          <template slot-scope="scope">
            {{ scope.row.item_code }} / {{ scope.row.item_title }}
          </template>
        </el-table-column>
        <el-table-column prop="plan_num" label="应调拨数量" width="140">
          <template slot-scope="scope">
            <span v-if="!!scope.row.plan_num">{{scope.row.plan_num}}件</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="实际调拨数量" width="140">
          <template slot-scope="scope">
            <span v-if="!!scope.row.num">{{scope.row.num}}件</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!--  展开行  -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-if="Array.isArray(scope.row.distribute_details)"
              v-for="item in scope.row.distribute_details"
            >
              <el-col :xs="6">
                <el-form-item label="批次：">
                  <span>{{ item.batch_code }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="6">
                <el-form-item label="调拨数量：">
                  <span>{{ item.num }}件</span>
                </el-form-item>
              </el-col>
              <el-col :xs="6">
                <el-form-item label="收货单号：">
                  <span>{{ item.qaer_id }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="6">
                <el-form-item label="收货数量：">
                  <span>{{ item.num_arrive }}件</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-form-area>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col, Table, TableColumn, Tag} from "element-ui";
  import {FormArea} from '@/common';
  import {Constant, DataHandle} from '@/util';
  export default {
    name: "distribute-waybill-detail",
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
        DataHandle: DataHandle,
        distribulte_waybill_status: Constant.DISTRIBUTE_WAYBILL_STATUS(), // 调拨计划列表状态
        distribulte_waybill_status_type: Constant.DISTRIBUTE_WAYBILL_STATUS_TYPE,
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
