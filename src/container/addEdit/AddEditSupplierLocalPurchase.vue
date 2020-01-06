<template>
  <div>
    <add-edit-layout :title="returnPageTitles('地采订单')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <div class="f-r" style="position: relative; right: -84px;" v-if="pageType === 'detail'">
          <el-tag size="small" :type="purchaseStatusType[detail.status]" disable-transitions>
            {{purchaseStatus[detail.status]}}
          </el-tag>
        </div>
        <h6 class="subtitle">采购信息</h6>
        <el-row>
          <el-form-item label="商品" prop="item_id">
            <select-item v-model="detail.item_id" size="medium" supType="local_pur" :provinceCode="province.code" @change="selectGItem" :disabled="pageType !== 'add' ? true : false" filterable></select-item>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="地采单号" v-if="pageType === 'detail'">
              <el-input size="medium" :value="detail.code" disabled placeholder="系统自动生成"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期" prop="purchase_date">
              <el-date-picker size="medium" v-model="detail.purchase_date" value-format="yyyy-MM-dd" placeholder="采购日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供货商" prop="supplier_id">
              <select-supplier supplierType="local_pur" size="medium" :itemId="detail.item_id" v-model="detail.supplier_id" :disabled="pageType !== 'add' ? true : false"/>
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
        <h6 class="subtitle">关联入库单</h6>
        <div style="padding: 0 30px; margin-bottom: 30px;">
          <el-table :data="detail.instocks" :row-class-name="highlightRowClassName">
            <el-table-column prop="code" label="入库单号"></el-table-column>
            <el-table-column prop="ware_title" label="库仓"></el-table-column>
            <el-table-column prop="num" label="入库数量">
              <template slot-scope="scope">{{scope.row.num}}件</template>
            </el-table-column>
            <el-table-column prop="created" label="入库时间"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">{{scope.row.id}}已入库</template>
            </el-table-column>
          </el-table>
        </div>
        <h6 class="subtitle">操作记录</h6>
        <div style="padding: 0 30px;">
          <el-table :data="detail.logs" :row-class-name="highlightRowClassName">
            <log-modified-detail :modifiedDetail="scope.row.modified_detail"/>
            <el-table-column prop="created" label="时间"></el-table-column>
            <el-table-column label="操作内容">
              <template slot-scope="scope">{{logTypes[scope.row.category]}}</template>
            </el-table-column>
            <el-table-column prop="modified_attrs" label="备注"></el-table-column>
            <el-table-column prop="operator_name" label="操作人"></el-table-column>
          </el-table>
        </div>
      </template>

      <div class="bottom-btn">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'"
            v-if="(auth.isAdmin || auth.SupplierLocalPurchaseEdit) && pageType === 'detail' && detail.audit_status === 'init'">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
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
  created() {
  },
  data(){
    let initDetail = {
      purchase_date: '',
      supplier_id: '',
      item_id: '',
      num: '',
      price: '',
      item: {},
      instocks: [],
      logs: []
    }
    return {
      purchaseStatus: Constant.PURCHASE_STATUS(),
      purchaseStatusType: Constant.PURCHASE_STATUS_TYPE,
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        purchase_date: [
          { required: true, message: '请选择采购日期', trigger: 'change' }
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
        price: [
          { required: true, message: '请输入金额', trigger: 'change' },
        ],
      },
      logTypes: {
        edit: '修改',
        add: '新增',
        audit_suc: '审核通过',
        audit_fail: '审核不通过'
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type || 'add';
      if(data){
        this.supplierLocalPurchaseDetail(data.id);
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
      }
    },
    //获取详情
    async supplierLocalPurchaseDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supplierLocalPurchaseDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
