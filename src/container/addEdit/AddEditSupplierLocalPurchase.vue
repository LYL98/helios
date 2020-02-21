<template>
  <div>
    <add-edit-layout :title="returnPageTitles('反采订单')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <div class="f-r" style="position: relative; right: -84px;" v-if="pageType === 'detail'">
          <el-tag size="small" :type="purchaseStatusType[detail.status]" disable-transitions>
            {{purchaseStatus[detail.status]}}
          </el-tag>
        </div>
        <h6 class="subtitle">采购信息</h6>
        <el-row>
          <el-form-item label="商品" prop="item_id">
            <select-item v-model="detail.item_id" placeholder="商品编号/名称" size="medium" supType="local_pur" :provinceCode="province.code" @change="selectGItem" :disabled="pageType !== 'add' ? true : false" filterable clearable></select-item>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="反采单号" v-if="pageType === 'detail'">
              <el-input size="medium" :value="detail.code" disabled placeholder="系统自动生成"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期" prop="order_date">
              <el-date-picker size="medium" v-model="detail.order_date" value-format="yyyy-MM-dd" placeholder="采购日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计送达" prop="estimate_arrive_at">
              <el-date-picker size="medium" type="datetime" v-model="detail.estimate_arrive_at" value-format="yyyy-MM-dd HH:mm:ss" placeholder="预计到货" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier_id">
              <select-supplier supplierType="local_pur" size="medium" :pItemId="detail.p_item_id" v-model="detail.supplier_id" :disabled="pageType !== 'add' ? true : false"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量" prop="num">
              <input-number size="medium" v-model="detail.num" unit="件" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购价" prop="price_buy">
              <input-price size="medium" v-model="detail.price_buy"/>
            </el-form-item>
          </el-col>
          <!--含筐-->
          <template v-if="detail.frame_code">
            <el-col :span="12">
              <el-form-item label="筐金额"><input-price size="medium" :value="detail.num * detail.frame_price" disabled/></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购商品金额"><input-price size="medium" :value="detail.num * detail.price_buy" disabled/></el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="采购总金额">
              <input-price size="medium" :value="detail.num * detail.price_buy + detail.num * detail.frame_price" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template v-if="pageType === 'detail'">
        <template v-if="detail.instocks.length > 0">
          <h6 class="subtitle">关联入库单</h6>
          <div style="padding: 0 30px; margin-bottom: 30px;">
            <el-table :data="detail.instocks" :row-class-name="highlightRowClassName">
              <el-table-column prop="code" label="入库单号">
                <template slot-scope="scope">
                  <span v-if="(auth.isAdmin || auth.SupplierLocalPurchaseDetailStock) && fromPage !== 'Inventory'" class="link-item"
                    @click="handleShowAddEdit('AddEditWarehouseStockPending', scope.row, 'detail_' + scope.row.in_type)">{{scope.row.code}}</span>
                  <span v-else>{{scope.row.code}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="入库数量">
                <template slot-scope="scope">{{scope.row.num}}件</template>
              </el-table-column>
              <el-table-column prop="created" label="入库时间"></el-table-column>
              <el-table-column prop="status" label="状态" width="140">
                <template slot-scope="scope">{{inventoryStatus[scope.row.status]}}</template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        
        <h6 class="subtitle">操作记录</h6>
        <div style="padding: 0 30px;">
          <el-table :data="detail.logs" :row-class-name="highlightRowClassName">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <log-modified-detail :modifiedDetail="scope.row.modified_detail"/>
              </template>
            </el-table-column>
            <el-table-column prop="created" label="时间"></el-table-column>
            <el-table-column label="操作内容">
              <template slot-scope="scope">{{logTypes[scope.row.category]}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">{{returnRemark(scope.row)}}</template>
            </el-table-column>
            <el-table-column prop="operator_name" label="操作人" width="140"></el-table-column>
          </el-table>
        </div>
      </template>

      <div class="bottom-btn">
        <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, InputPrice } from '@/common';
import { SelectSupplier, SelectItem, LogModifiedDetail } from '@/component';

export default {
  name: "AddEditSupplierLocalPurchase",
  mixins: [addEditMixin],
  components: {
    'select-supplier': SelectSupplier,
    'select-item': SelectItem,
    'input-number': InputNumber,
    'input-price': InputPrice,
    'log-modified-detail': LogModifiedDetail
  },
  props: {
    fromPage: { type: String, defalut: '' }, //来自页面 fromPage：Inventory 库存
  },
  created() {
  },
  data(){
    let initDetail = {
      order_date: '',
      estimate_arrive_at: '',
      supplier_id: '',
      item_id: '',
      num: '',
      frame_price: 0,
      price_buy: '',
      item: {},
      instocks: [],
      logs: []
    }
    return {
      purchaseStatus: Constant.PURCHASE_STATUS(),
      purchaseStatusType: Constant.PURCHASE_STATUS_TYPE,
      inventoryStatus: Constant.INVENTORY_STATUS(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        order_date: [
          { required: true, message: '请选择采购日期', trigger: 'change' }
        ],
        estimate_arrive_at: [
          { required: true, message: '请选择预计到达时间', trigger: 'change' }
        ],
        supplier_id: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        item_id: [
          {required: true, message: '请选择商品', trigger: 'change'},
        ],
        num: [
          { required: true, message: '请输入件数', trigger: 'change' },
        ],
        price_buy: [
          { required: true, message: '请输入金额', trigger: 'change' },
        ],
      },
      logTypes: {
        edit: '修改',
        auto_add: '自动新增',
        manual_add: '手动新增',
        audit_suc: '审核通过',
        audit_fail: '审核不通过',
        close: '关闭'
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type || 'detail';
      if(data){
        this.fromSupplierOrderDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async fromSupplierOrderDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.fromSupplierOrderDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //选择商品时
    selectGItem(data){
      //如果有筐
      if(data.frame_code){
        let { detail } = this;
        detail.frame_code = data.frame_code;
        detail.frame_price = data.frame.price;
        this.$data.detail = detail;
      }
    },
    //返回备注
    returnRemark(data){
      if(data.remark) return data.remark;
      if((data.category ==='audit_suc' || data.category ==='audit_fail') && data.after && data.after.audit_remark) return data.after.audit_remark;
      if(data.category ==='close' && data.after && data.after.close_remark) return data.after.close_remark;
      return '';
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
  .link-item{
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      opacity: .7;
    }
  }
</style>
