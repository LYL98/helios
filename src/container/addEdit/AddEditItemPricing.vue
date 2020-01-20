<template>
  <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="今日销售价" prop="price_sale">
        <input-price size="medium" v-model="detail.price_sale"/>
      </el-form-item>
      <el-form-item label="供应商报价">
        <el-table :data="supplierList" width="100%" size="mini" :row-class-name="highlightRowClassName">
          <el-table-column label="供应商名称">
            <template slot-scope="scope">{{scope.row.supplier.title}}<span v-if="scope.row.is_main" class="main-tag no-pre">主供应商</span></template>
          </el-table-column>
          <el-table-column label="供应商报价" width="120">
            <template slot-scope="scope">
              &yen;{{returnPrice(scope.row.price)}}
            </template>
          </el-table-column>
          <el-table-column label="供应商库存" width="100">
            <template slot-scope="scope">{{scope.row.num}}件</template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <div style="margin-left: 140px; margin-top: 40px;">
      <el-button size="medium" @click.native="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
    </div>
  </add-edit-layout>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { NumberKey, InputNumber, InputPrice } from '@/common';

export default {
  name: "AddEditItemPricing",
  mixins: [addEditMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice
  },
  data(){
    let that = this;
    //今日售价校验
    let validPriceSale = function (rules, value, callback) {
      let { detail } = that;
      if (Number(value) >= Number(detail.suggest_min) && Number(value) <= Number(detail.suggest_max)) {
        callback();
      }else{
        callback('销售价要在建议价之间')
      }
    };

    return {
      weightScope: Constant.WEIGHT_SCOPE,//重量浮动范围
      initDetail: {},
      rules: {
        price_sale: [
          { required: true, message: '请输入今日销售价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日销售价', trigger: 'change' },
          //{ validator: validPriceSale, trigger: 'change' },
        ],
      },
      supplierList: [], //供应商报价列表
      pageTitles: {
        add: '报价',
        edit: '修改报价',
      },
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data, type){
      this.$data.pageType = type;
      let d = this.copyJson(data);
      d.price_sale = d.price_sale || '';
      this.$data.detail = d;
      this.itemPriceDetail(d);
    },
    //获取供应商列表
    async itemPriceDetail(data){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemPriceDetail, {
        item_id: data.item_id,
        opt_date: data.opt_date
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.supplierList = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },

    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemPriceFix, {
        province_code: this.$province.code,
        item_id: detail.item_id,
        price_sale: detail.price_sale
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '商品已报价', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemPricing');
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
  .main-tag{
    font-size: 12px;
    color: #fff;
    background: #ff5252;
    border-radius: 3px;
    padding: 0 5px;
    margin-left: 5px;
  }
</style>
