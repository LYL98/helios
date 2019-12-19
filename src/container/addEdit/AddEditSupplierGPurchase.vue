<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" label-position="right" :disabled="pageType === 'detail'" label-width="140px" style="width: 98%; max-width: 1400px; margin-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="采购日期" prop="purchase_date">
          <el-date-picker size="medium" v-model="detail.purchase_date" value-format="yyyy-MM-dd" placeholder="采购日期"/>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier_id">
          <select-supplier supplierType="global_pur" size="medium" v-model="detail.supplier_id" style="width: 360px;" :disabled="detail.id ? true : false"/>
        </el-form-item>
        <el-form-item label="商品" prop="item_id">
          <select-g-item v-model="detail.item_id" size="medium" :supplierId="detail.supplier_id" style="width: 360px;" :disabled="detail.id ? true : false"></select-g-item>
        </el-form-item>
        <el-form-item label="件数" prop="num">
          <input-number size="medium" v-model="detail.num" style="width: 240px;" unit="件" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <input-price size="medium" v-model="detail.price" style="width: 240px;"/>
        </el-form-item>
        <el-form-item label="总价">&yen;&nbsp;{{returnPrice(detail.num * detail.price)}}</el-form-item>
      </el-form>

      <div style="margin-left: 110px; margin-top: 80px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'"
            v-if="(auth.isAdmin || auth.SupplierGPurchaseEdit) && pageType === 'detail' && detail.audit_status === 'init'">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config } from '@/util';
import { InputNumber, InputPrice } from '@/common';
import { SelectSupplier, SelectGItem } from '@/component';

export default {
  name: "AddEditSupplierGPurchase",
  mixins: [addEditMixin],
  components: {
    'select-supplier': SelectSupplier,
    'select-g-item': SelectGItem,
    'input-number': InputNumber,
    'input-price': InputPrice
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
    }
    return {
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
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
      pageTitles: {
        add: '新增统采订单',
        edit: '修改统采订单',
        detail: '统采订单详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.supplierGPurchaseDetail(data.id);
        this.$data.pageType = type;
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
        this.$data.pageType = 'add';
      }
    },
    //获取详情
    async supplierGPurchaseDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supplierGPurchaseDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'edit' ? 'supplierGPurchaseEdit' : 'supplierGPurchaseAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `统采订单${pageType === 'edit' ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableSupplierGPurchase');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
