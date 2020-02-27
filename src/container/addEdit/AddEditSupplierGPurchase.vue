<template>
  <div>
    <add-edit-layout :title="returnPageTitles('预采订单')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <div class="f-r" style="position: relative; right: -84px;" v-if="pageType === 'detail'">
          <el-tag size="small" :type="purchaseStatusType[detail.status]" disable-transitions>
            {{purchaseStatus[detail.status]}}
          </el-tag>
        </div>
        <h6 class="subtitle">采购信息</h6>
        <el-row>
          <el-form-item label="商品" prop="p_item_id">
            <select-g-item v-model="detail.p_item_id" placeholder="商品编号/名称" size="medium" supType="global_pur" @change="selectGItem" :disabled="pageType !== 'add' ? true : false" filterable clearable></select-g-item>
          </el-form-item>
          <el-col :span="12" v-if="pageType === 'detail'">
            <el-form-item label="预采单号">
              <el-input size="medium" :value="detail.code" disabled placeholder="系统自动生成"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期" prop="order_date">
              <el-date-picker size="medium" v-model="detail.order_date" value-format="yyyy-MM-dd" placeholder="采购日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到货" prop="estimate_arrive_at">
              <el-date-picker size="medium" type="datetime" v-model="detail.estimate_arrive_at" value-format="yyyy-MM-dd HH:mm:ss" placeholder="预计到货" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplier_id">
              <select-supplier size="medium" :pItemId="detail.p_item_id" v-model="detail.supplier_id" :disabled="pageType !== 'add' ? true : false" @change="selectSupplier"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量" prop="num">
              <input-number size="medium" v-model="detail.num" unit="件" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购价" prop="price_buy">
              <input-price size="medium" v-model="detail.price_buy" :placeholder="supplierPrice ? '￥' + returnPrice(supplierPrice) + '（仅供参考）': ''"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="送达仓" prop="storehouse_id">
              <select-storehouse size="medium" :provinceCode="storeProCode" v-model="detail.storehouse_id" :disabled="pageType !== 'add' ? true : false"/>
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
                  <span v-if="(auth.isAdmin || auth.SupplierGPurchaseDetailStock) && fromPage !== 'Inventory'" class="link-item"
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
      <!--库存页面-->
      <div v-if="fromPage === 'Inventory'" class="bottom-btn">
        <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
      </div>
      <!--其它-->
      <div class="bottom-btn" v-else>
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'"
            v-if="(auth.isAdmin || auth.SupplierGPurchaseEdit) && pageType === 'detail' && detail.status === 'init'">修改</el-button>
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
import { SelectSupplier, SelectGItem, LogModifiedDetail, SelectStorehouse } from '@/component';

export default {
  name: "AddEditSupplierGPurchase",
  mixins: [addEditMixin],
  components: {
    'select-supplier': SelectSupplier,
    'select-g-item': SelectGItem,
    'input-number': InputNumber,
    'input-price': InputPrice,
    'log-modified-detail': LogModifiedDetail,
    'select-storehouse': SelectStorehouse
  },
  props: {
    fromPage: { type: String, defalut: '' }, //来自页面 fromPage：Inventory 库存
  },
  computed: {
    storeProCode(){
      let { selectSupplierData } = this;
      if(!selectSupplierData.province_code || selectSupplierData.province_code === 'nationwide'){
        return '';
      }
      return selectSupplierData.province_code;
    }
  },
  created() {
  },
  data(){
    let initDetail = {
      order_date: '',
      estimate_arrive_at: '',
      supplier_id: '',
      storehouse_id: '',
      p_item_id: '',
      num: '',
      price_buy: '',
      frame_price: 0,
      instocks: [],
      logs: []
    }
    return {
      purchaseStatus: Constant.PURCHASE_STATUS(),
      purchaseStatusType: Constant.PURCHASE_STATUS_TYPE,
      inventoryStatus: Constant.INVENTORY_STATUS(),
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
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
        p_item_id: [
          {required: true, message: '请选择商品', trigger: 'change'},
        ],
        num: [
          { required: true, message: '请输入件数', trigger: 'change' },
        ],
        price_buy: [
          { required: true, message: '请输入金额', trigger: 'change' },
        ],
        storehouse_id: [
          { required: true, message: '请选择送达仓', trigger: 'change' },
        ],
      },
      logTypes: {
        add: '新增',
        edit: '修改',
        manual_add: '新增',
        audit_suc: '审核通过',
        audit_fail: '审核不通过',
        close: '关闭'
      },
      supplierPrice: 0, //供应商价格
      selectSupplierData: {}
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type || 'add';
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
        let rd = res.data;
        //场地收货的记录不显示关联入库单
        for(let i = 0; i < rd.instocks.length; i++){
          if(rd.instocks[i].qa_event === 'accept'){
            rd.instocks.remove(i);
            i = i - 1;
          }
        }
        this.$data.detail = rd;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //选择商品时
    selectGItem(data){
      let { detail } = this;
      //如果有筐
      if(data.frame_code){
        detail.frame_code = data.frame_code;
        detail.frame_price = data.frame.price;
      }
      detail.storehouse_id = '';
      detail.supplier_id = '';
      this.$data.selectSupplierData = {};
      this.$data.detail = detail;
      this.supplierPrice = 0;
      setTimeout(()=>{
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].clearValidate();
      }, 0);
    },
    //选择供应商
    async selectSupplier(data){ 
      let { detail } = this;
      this.$data.selectSupplierData = data;
      let res = await Http.get(Config.api.fromSupplierPItemPriceBuy, {
        p_item_id: detail.p_item_id,
        supplier_id: data.id
      });
      if(res.code === 0){
        this.$data.supplierPrice = res.data;
      }
      this.$data.detail.storehouse_id = '';
      setTimeout(()=>{
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].clearValidate();
      }, 0);
    },
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'edit' ? 'fromSupplierOrderEdit' : 'fromSupplierOrderAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `预采订单${pageType === 'edit' ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableSupplierGPurchase');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
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
