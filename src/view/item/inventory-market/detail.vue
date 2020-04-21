<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <div class="f-r" style="position: relative; right: -84px;">
        <el-tag size="small" :type="inventorySaleStatusType[returnSaleStatus()]" disable-transitions>
          {{inventorySaleStatus[returnSaleStatus()]}}
        </el-tag>
      </div>
      <h6 class="subtitle">商品信息</h6>
      <el-row>
        <el-form-item label="商品编号/名称">{{item.item_code}}/{{item.item_title}}</el-form-item>
        <el-col :span="12">
          <el-form-item label="批次">{{item.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{item.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓">{{item.storehouse && item.storehouse.title}}</el-form-item>
        </el-col>
      </el-row>
      <h6 class="subtitle">变动信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="变动数量">{{item.chg_num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变动类型">{{supOptTypes[item.opt_type]}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注">{{item.remark}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="变动人">{{item.creator && item.creator.realname || '系统'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变动时间">{{item.created}}</el-form-item>
        </el-col>
      </el-row>
      <h6 class="subtitle">销售信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售金额">&yen;{{returnPrice(item.amount)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注">{{item.sale_remark}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售人">{{item.saler && item.saler.realname || '系统'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售时间">{{item.sale_time}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { Form, FormItem, Row, Col, Tag } from "element-ui";
  import { Http, Config, Constant, DataHandle } from '@/util';

  export default {
    name: "detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-tag': Tag
    },
    props: {
      item: { type: Object, default: {} },
    },
    data() {
      return {
        inventorySaleStatus: Constant.INVENTORY_SALE_STATUS(),
        inventorySaleStatusType: Constant.INVENTORY_SALE_STATUS_TYPE,
        supOptTypes: Constant.SUP_OPT_TYPES(),
        returnPrice: DataHandle.returnPrice
      }
    },
    methods: {
      //返回状态
      returnSaleStatus(){
        if(this.item.amount) return 'saled';
        return 'wait_sale';
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
