<template>
  <div class="receiving-allot">
    <el-dialog :title="`报价：${detail.code} ${detail.title}`" :visible="isShow" width="680px" :before-close="handleCancel" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" style="width: 620px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="昨日询价">
              <span class="show-span">
                &yen;{{detail.price_buy_last}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="今日询价" prop="price_buy">
              <span class="input-span" @click="clickPriceBuy">
                {{detail.price_buy}}
              </span>
              <span class="input-behind-span">元</span>
              <el-button size="mini" style="margin-left: 10px;" @click.native="usePriceBuyLast">使用昨日询价</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="昨日加价率">
              <span class="show-span">
                {{returnRate(detail.price_buy_last, detail.price_sale_last)}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="建议价" prop="net_weight_temp">
              <span class="show-span">
                {{detail.suggest_price}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="昨日销售价">
              <span class="show-span">
                &yen;{{detail.price_sale_last}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="今日销售价" prop="price_sale">
              <span class="input-span" @click="clickPriceSale">
                {{detail.price_sale}}
              </span>
              <span class="input-behind-span">元</span>
              <span style="margin-left: 10px;">今日加价率：{{returnRate(detail.price_buy, detail.price_sale)}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="库存">
              <span class="show-span">
                {{detail.item_stock}}&nbsp;件
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="新库存" prop="new_item_stock">
              <span class="input-span" @click="clickNewItemStock">
                {{detail.new_item_stock}}
              </span>
              <span class="input-behind-span">件</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleAddEdit">确定报价</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "AddEditItemPricing",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    return {
      weightScope: Constant.WEIGHT_SCOPE,//重量浮动范围
      initDetail: {
        province_code: this.$province.code
      },
      rules: {
        price_buy: [
          { required: true, message: '请输入今日询价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日询价', trigger: 'change' }
        ],
        price_sale: [
          { required: true, message: '请输入今日销售价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日销售价', trigger: 'change' }
        ],
        new_item_stock: [
          { required: true, message: '请输入库存', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        let d = JSON.parse( JSON.stringify(data));
        d.province_code = this.$province.code;
        d.new_item_stock = d.item_stock;
        d.price_buy_last = Number(d.price_buy_last);
        d.price_buy = d.price_buy ? Number(d.price_buy) : '';
        d.price_sale = d.price_sale ? Number(d.price_sale) : '';
        this.$data.detail = d;
      }else{
        this.$data.detail = JSON.parse( JSON.stringify( this.initDetail ));
      }
      this.$data.isShow = true;
    },
    //返回建议价(今日询价，加价率)
    returnSuggestPrice(priceBuy){
      let { detail } = this;
      let min = DataHandle.returnSuggestPrice(priceBuy, detail.rise_min);
      let max = DataHandle.returnSuggestPrice(priceBuy, detail.rise_max);
      return `￥${min} - ￥${max}`;
    },
    //返回加价率(询价，销售价)
    returnRate(p1, p2){
      if(!p1 || !p2) return '-';
      return this.returnMarkup(p2 / p1 - 1) + '%';
    },
    //使用昨日询价
    usePriceBuyLast(){
      let that = this;
      let { detail } = that;
      let price = detail.price_buy_last; //昨日采购价
      let priceSale = that.returnSuggestPrice(price); //今日售价(从建议价读取)
      detail.suggest_price = priceSale;
      detail.price_buy = price;
      that.$data.detail = detail;
      that.$refs['ruleForm'].validate(()=>{return false;});
    },
    //输入今日询价
    clickPriceBuy(){
      let that = this;
      let { detail } = that;
      let p = detail.price_buy
      NumberKey.show({
        num: p || '',
        type: 'Price',
        confirm(price){
          let priceSale = that.returnSuggestPrice(price); //今日售价
          detail.suggest_price = priceSale;
          detail.price_buy = price;
          that.$data.detail = detail;
          that.$refs['ruleForm'].validate(()=>{return false;});
        }
      });
    },
    //修改今日销售价
    clickPriceSale(){
      let that = this;
      let { detail } = that;
      let p = detail.price_sale;
      NumberKey.show({
        num: p || '',
        type: 'Price',
        confirm(price){
          detail.price_sale = price;
          that.$data.detail = detail;
          that.$refs['ruleForm'].validate(()=>{return false;});
        }
      });
    },
    //修改库存
    clickNewItemStock(){
      let that = this;
      let { detail } = that;
      NumberKey.show({
        num: detail.new_item_stock || '',
        type: 'Number',
        confirm(num){
          detail.new_item_stock = num;
          that.$data.detail = detail;
          that.$refs['ruleForm'].validate(()=>{return false;});
        }
      });
    },

    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemPriceFix, {
        ...detail,
        price_buy: this.handlePrice(detail.price_buy),
        price_sale: this.handlePrice(detail.price_sale)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        //data.index = detail.index;
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
  .show-span{
    font-size: 18px;
  }
  .input-span{
    font-size: 18px;
    border: 1px solid #999;
    width: 106px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    float: left;
    text-align: center;
  }
  .input-behind-span{
    height: 34px;
    line-height: 34px;
    float: left;
    font-size: 18px;
    margin-left: 5px;
  }
</style>
