<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="inventoryData" :rules="rules" ref="ruleForm">
        <!--采购、详情-->
        <el-row v-if="judgeOrs(pageType, ['add_purchase', 'detail_purchase'])">
          <h6 class="subtitle">采购信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="采购单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期">{{detail.order_date || detail.purchase_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可入库数量">{{detail.num - detail.num_in}}件</el-form-item>
          </el-col>
        </el-row>

        <!--调拨、详情-->
        <el-row v-else-if="judgeOrs(pageType, ['add_allot', 'detail_allot'])">
          <h6 class="subtitle">调拨信息</h6>
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
          <el-col :span="12">
            <el-form-item label="调拨单号">{{detail.code}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">{{detail.supplier_title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调出仓">{{detail.src_store_house.title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
          <el-col :span="12">
            <el-form-item label="可售日期">{{detail.available_date}}</el-form-item>
          </el-col>
            <el-form-item label="可入库数量">{{detail.num - detail.num_in}}件</el-form-item>
          </el-col>
        </el-row>

        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_allot'])">
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
                <cascader-warehouse-tray size="medium" :value="item.tray_ids"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库数量">
                <input-number size="medium" :value="inventoryData.num" unit="件"/>
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
        </template>
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
      src_store_house: {}
    }
    let initInventoryData = {
      province_code: this.$province.code,
      produce_date: '',
      in_type: '',
      relate_order_id: '',
      trays: [{
        tray_ids: [],
        tray_id: '',
        num: ''
      }]
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
        produce_date: data.produce_date || '',
        in_type: data.order_type || 'distribute', //'global_pur', 'local_pur', 'distribute'
        relate_order_id: data.id,
      };
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(){
      let { inventoryData, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supInStockAdd, inventoryData);
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
