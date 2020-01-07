<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="inventoryData" :rules="rules" ref="ruleForm">
        <h6 class="subtitle">采购信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="统采单号">123456789</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编号/名称">123456/普哥的商品</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期">{{detail.order_date || detail.purchase_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">123456</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">123件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可入库数">123件</el-form-item>
          </el-col>
        </el-row>
        <h6 class="subtitle">入库信息</h6>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产日期">
              <el-date-picker size="medium" v-model="inventoryData.produce_date" value-format="yyyy-MM-dd" placeholder="生产日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in inventoryData.trays" :key="index">
          <el-col :span="12">
            <el-form-item label="入库">
              <cascader-warehouse-tray size="medium"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库数量">
              <input-number size="medium" :value="inventoryData.num"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <el-button @click.native="add" size="mini" type="primary" plain>添加仓库</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="bottom-btn">
        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_allot'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
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
import { CascaderWarehouseTray } from '@/component';

export default {
  name: "AddEditWarehouseStockPending",
  mixins: [addEditMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'cascader-warehouse-tray': CascaderWarehouseTray
  },
  created() {
  },
  data(){
    let initDetail = {
      item: {},
      supplier: {}
    }
    let initInventoryData = {
      province_code: this.$province.code,
      produce_date: '',
      in_type: '',
      relate_order_id: '',
      trays: []
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      initInventoryData: initInventoryData,
      inventoryData: this.copyJson(initInventoryData),
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
        add_purchase: '采购入库',
        add_allot: '调拨入库',
        detail_purchase: '采购入库详情',
        detail_allot: '调拨入库详情',
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type;
      this.$data.detail = data;
      this.$data.inventoryData = {
        ...this.initInventoryData,
      };
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'add_purchase' ? '' : ''], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${pageType === 'add_purchase' ? '统采' : '调拨'}入库成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableWarehouseStockPending');
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
