<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="addData" :rules="rules" ref="ruleForm">
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
            <el-form-item label="调出仓">{{detail.src_storehouse.title}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调拨数量">{{detail.num}}件</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可售日期">{{detail.available_date}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可入库数量">{{detail.num - detail.num_in}}件</el-form-item>
          </el-col>
        </el-row>

        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_allot'])">
          <h6 class="subtitle">入库信息</h6>
          <el-row>
            <el-col :span="10">
              <el-form-item label="生产日期" prop="produce_date">
                <el-date-picker size="medium" v-model="addData.produce_date" :disabled="addData.produce_date_disabled" value-format="yyyy-MM-dd" placeholder="生产日期" style="width: 100%;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="入库">
                <el-input size="medium" value="临时库" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="入库数量" prop="num">
                <input-number size="medium" v-model="addData.num" unit="件"/>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div class="bottom-btn">
        <template v-if="judgeOrs(pageType, ['add_purchase', 'add_allot'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit" data-status="part_in">部分收货</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit" data-status="all_in">全部收货</el-button>
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
  name: "AddEditOperateReceiving",
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
      src_storehouse: {}
    }
    let initAddData = {
      province_code: this.$province.code,
      produce_date_disabled: false,
      produce_date: '',
      order_type: '',
      relate_order_id: '',
      storehouse_id: '',
      warehouse_id: '',
      num: ''
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      initAddData: initAddData,
      addData: this.copyJson(initAddData),
      rules: {
        produce_date: [
          { required: true, message: '请选择采购日期', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请输入入库数量', trigger: 'change' }
        ]
      },
      pageTitles: {
        add_purchase: '收货',
        add_allot: '收货',
        detail_purchase: '采购单详情',
        detail_allot: '调拨单详情',
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type;
      this.$data.detail = data;
      this.$data.addData = this.copyJson({
        ...this.initAddData,
        produce_date_disabled: data.produce_date ? true : false,
        produce_date: data.produce_date || '',
        order_type: data.order_type || 'distribute', //'local_pur', 'distribute'
        relate_order_id: data.id,
        province_code: this.$province.code
      });
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(e){
      let { detail, addData, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supAcceptAdd, {...addData, status: e.currentTarget.dataset.status});
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '收货成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableOperateReceiving');
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
