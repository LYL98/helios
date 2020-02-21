<template>
  <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">商品报价</h6>
      <el-form-item label="商品编号/名称">
        {{detail.code}}/{{detail.title}}
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="今日销售价" prop="price_sale">
            <input-price size="medium" v-model="detail.price_sale" :placeholder="'建议：' + returnSuggestPrice(detail)" :disabled="false"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <template v-if="detail.opt_date === today && judgeOrs(pageType, ['detail', 'edit']) && (auth.isAdmin || auth.ItemPriceFix)  && detail.available_num > 0">
            <a href="javascript:void(0);" class="edit-a" v-if="pageType === 'detail'" @click="showHideEdit('edit')">修改</a>
            <template v-else>
              <a href="javascript:void(0);" class="edit-a" @click="handleAddEdit">确认</a>
              <a href="javascript:void(0);" class="edit-a" @click="showHideEdit('detail')">取消</a>
            </template>
          </template>
          <template v-else>&nbsp;</template>
        </el-col>
        <el-col :span="11">
          <el-form-item label="可售数量">
            <input-number size="medium" disabled :value="detail.available_num" unit="件"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin: 0 0 30px 30px;">
        <el-collapse>
          <el-collapse-item title="查看报价参考信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="今日供货价">
                  {{detail.price_buy ? '￥' + returnPrice(detail.price_buy) : '-'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="今日建议价">{{returnSuggestPrice(detail)}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昨日供货价">
                  {{detail.price_buy_last ? '￥' + returnPrice(detail.price_buy_last) : '-'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昨日销售价">
                  {{detail.price_sale_last ? '￥' + returnPrice(detail.price_sale_last) : '-'}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昨日销量">{{returnUnit(detail.price_sale_last, '件', '-')}}</el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
      <h6 class="subtitle">库存信息</h6>
      <div style="padding: 0 0 30px 30px;">
        <el-table :data="priceData.stocks" width="100%" size="mini" :row-class-name="highlightRowClassName">
          <el-table-column label="批次">
            <template slot-scope="scope">{{scope.row.batch_code}}</template>
          </el-table-column>
          <el-table-column label="采购价" width="240">
            <template slot-scope="scope">
              &yen;{{returnPrice(scope.row.price)}}
            </template>
          </el-table-column>
          <el-table-column label="库存" width="180">
            <template slot-scope="scope">{{returnUnit(scope.row.num, '件', '-')}}</template>
          </el-table-column>
        </el-table>
      </div>

      <h6 class="subtitle">调拨信息</h6>
      <div style="padding: 0 0 30px 30px;">
        <el-table :data="priceData.distributes" width="100%" size="mini" :row-class-name="highlightRowClassName">
          <el-table-column label="调拨单号">
            <template slot-scope="scope">{{scope.row.code}}</template>
          </el-table-column>
          <el-table-column label="采购价" width="240">
            <template slot-scope="scope">
              &yen;{{returnPrice(scope.row.price)}}
            </template>
          </el-table-column>
          <el-table-column label="调拨数量" width="180">
            <template slot-scope="scope">{{returnUnit(scope.row.num, '件', '-')}}</template>
          </el-table-column>
        </el-table>
      </div>

      <h6 class="subtitle">反采供应商信息</h6>
      <div style="padding: 0 0 30px 30px;">
        <el-table :data="priceData.biddings" width="100%" size="mini" :row-class-name="highlightRowClassName">
          <el-table-column label="供应商名称">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>
          <el-table-column label="供应商报价" width="240">
            <template slot-scope="scope">
              {{scope.row.bidding.price ? '￥' + returnPrice(scope.row.bidding.price) : '-'}}
            </template>
          </el-table-column>
          <el-table-column label="供应商库存" width="180">
            <template slot-scope="scope">
              {{returnUnit(scope.row.bidding.num, '件', '-')}}
              <a href="javascript:void(0);"
                v-if="detail.opt_date === today && (auth.isAdmin || auth.ItemPriceEditNum) && scope.row.bidding.id"
                @click="handleShowForm('FormItemPricingEditNum', scope.row)">增加</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>

    <div style="margin-left: 140px; margin-top: 20px;" v-if="pageType === 'add'">
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
      initDetail: {},
      rules: {
        price_sale: [
          { required: true, message: '请输入今日销售价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日销售价', trigger: 'change' },
          //{ validator: validPriceSale, trigger: 'change' },
        ],
      },
      priceData: {
        stocks: [],
        distributes: [],
        biddings: []
      },
      pageTitles: {
        add: '报价',
        edit: '修改报价',
        detail: '报价详情'
      },
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data, type){
      this.$data.pageType = type;
      let d = this.copyJson(data);
      d.price_sale = d.price_sale || '';
      d.price_sale_temp = d.price_sale; //修改时用到
      this.$data.detail = d;
      this.itemPriceDetail();
    },
    //详情时修改报价
    showHideEdit(pageType){
      this.$data.pageType = pageType;
      if(pageType === 'detail'){
        this.$data.detail.price_sale = this.detail.price_sale_temp;
      }
    },
    //获取供应商列表
    async itemPriceDetail(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemPriceDetail, {
        item_id: detail.item_id,
        opt_date: detail.opt_date
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.priceData = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //返回建议价(今日询价，今日加价率)
    returnSuggestPrice(item){
      let min = DataHandle.returnSuggestPrice(item.price_buy, item.rise_min);
      let max = DataHandle.returnSuggestPrice(item.price_buy, item.rise_max);
      
      if(min === '0' && max === '0') return '-';
      return `￥${this.returnPrice(min)} - ￥${this.returnPrice(max)}`;
    },

    //提交数据
    addEditData(){
      let { detail, priceData, pageType } = this;
      if(pageType === 'edit'){
        this.priceFix();
      }else{
        let str = '反采供应商尚未报价，确认报价后供应商将不可报价，是否确认报价';
        if(priceData.biddings.length > 0){
          str = '确认报价后，供应商的报价将不可更改，系统将根据该价格直接下单采购';
        }
        this.$messageBox.confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.priceFix();
        }).catch(() => {
          //console.log('取消');
        });
      }
    },
    //报价
    async priceFix(){
      let { detail, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemPriceFix, {
        province_code: this.$province.code,
        item_id: detail.item_id,
        price_sale: detail.price_sale
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '商品已报价', type: 'success'});
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemPricing');
        pc.getData(pc.query);
        
        if(pageType === 'edit'){
          this.$data.pageType = 'detail';
        }else{
          this.handleCancel(); //隐藏
        }
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
  .edit-a{
    margin-left: 10px;
    position: relative;
    top: 4px;
  }
</style>
