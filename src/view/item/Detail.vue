<template>
  <div class="item-detail">
    <el-dialog title="商品详情" :visible="isShow" width="1200px" top="5vh" :before-close="cancelAddEdit">
      <el-form class="custom-form-detail" label-position="right" label-width="110px" style="width: 1160px;">
        <el-form-item label="商品图片">
          <div style="display: flex">
            <div class="img-div" style="flex: 1;">
              <my-image-preview><img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/></my-image-preview>
            </div>
            <div style="width: 100px; display: flex; justify-content: flex-end">
              <el-tag :type="detail.is_audited ? 'info' : 'warning'">{{detail.is_audited ? '已审核' : '未审核'}}</el-tag>
            </div>
          </div>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="上架状态" prop="rank">
              <span class="detail">{{detail.is_audited ? (detail.is_on_sale ? '已上架' : '已下架') : '未上架'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="框"><span class="detail">{{detail.frame_code ? detail.frame.title : '-'}}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="今日销量">
              <span class="detail">{{detail.sale_num_day}} 件</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总销量">
              <span class="detail">{{detail.sale_num_total}} 件</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购员">
              <span class="detail">{{detail.buyer && detail.buyer.id ? detail.buyer.realname + ' ' + detail.buyer.phone : '-'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <h6 class="subtitle" style="padding-bottom: 8px; padding-top: 8px">基本信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商品名称"><span class="detail">{{detail.title}}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编号"><span class="detail">{{detail.code}}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产地"><span class="detail">{{detail.origin_place?detail.origin_place:'-'}}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="省份"><span class="detail">{{detail.province ? detail.province.title : '-'}}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售单位"><span class="detail">{{detail.sale_unit}}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否称重"><span class="detail">{{detail.is_weigh?'是':'否'}}</span></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="包装规格"><span class="detail">{{detail.package_spec?detail.package_spec:'-'}}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格"><span class="detail">{{detail.item_spec?detail.item_spec:'-'}}</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毛重"><span class="detail">{{detail.gross_weight_temp}}斤</span></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="净重"><span class="detail">{{detail.net_weight_temp}}斤</span></el-form-item>
          </el-col>
        </el-row>
        <!--商品价格分类-->
        <h6 class="subtitle" style="padding-bottom: 8px; padding-top: 8px">商品价格</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购价">
              <span class="price">&yen;{{detail.price_buy_temp}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售价">
              <span class="price">&yen;{{detail.price_sale_temp}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划加价率">
              <span class="detail">{{detail.markup_rate_temp}}%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="原价">
              <span class="price">&yen;{{detail.price_origin}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区域定价">
              <ul>
                <li
                  v-for="(item, index) in detail.city_prices"
                  style="display: flex; justify-content: space-between;"
                  v-if="index < 3 || isShowAllCityPrices"
                >
                  <div style="width: 200px;" class="ellipsis">{{ item.city_title }}</div>
                  <div style="width: 120px;"><span v-if="item.percent > 0">+</span>{{ item.percent }}%</div>
                  <div style="width: 120px;">{{ item.price_sale_piece }}元</div>
                </li>
              </ul>
              <el-button
                size="mini"
                plain
                type="primary"
                v-if="detail.city_prices.length > 3 && !isShowAllCityPrices"
                @click="isShowAllCityPrices = true"
              >查看全部</el-button>
              <el-button
                size="mini"
                plain
                type="primary"
                v-if="detail.city_prices.length > 3 && isShowAllCityPrices"
                @click="isShowAllCityPrices = false"
              >收起</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <!--其他信息分类-->
        <h6 class="subtitle" style="padding-bottom: 8px; padding-top: 8px">其他信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="排序" prop="rank">
              <span class="detail">{{detail.rank}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="展示分类">
              <span class="detail">{{detail.display_class ? detail.display_class.title : '-'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科学分类">
              <span class="detail">{{detail.system_class ? detail.system_class.title : '-'}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="预售商品">
              <span class="detail">{{detail.is_presale?'是':'否'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报价状态">
              <span class="detail">{{detail.is_quoted===0?'未报价':'已报价'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单率">
              <span class="detail">{{returnLowerRate(detail.lower_rate)}}%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="库存">
              <span class="detail">{{detail.item_stock}} 件</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大订货数量">
              <span class="detail">{{detail.order_num_max}} 件</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="detail.is_presale" label="配送日期">
              <span class="detail">{{detail.presale_begin}} 至 {{detail.presale_end}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="商品标签">
              <my-label :tags="detail.tags"></my-label>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品详情">
          <div v-html="!detail.content || detail.content === '' ? '-' : detail.content" class="my-quill-editor-detail"></div>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click.native="cancelAddEdit">确 认</el-button>
        </el-form-item>
      </el-form>
      <div style="height: 40px;"></div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, Input, MessageBox, Dialog, Radio, Col, Row, Tag } from 'element-ui';
import { Config, Constant, DataHandle } from '@/util';
import { ImagePreview, Label } from  '@/common'

export default {
  name: "Detail",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-radio': Radio,
    'el-col': Col,
    'el-row': Row,
    'el-tag': Tag,
    'my-image-preview': ImagePreview,
    'my-label': Label
  },
  created() {

  },
  computed: mapGetters({
    isShow: 'itemItemIsShowDetail',
    itemItemDetail: 'itemItemDetail'
  }),
  data(){
    return {
      auth: this.$auth,
      tencentPath: Config.tencentPath,
      isTitleFloat: false,
      itemStatus: Constant.ITEM_STATUS,
      detail: {
        images: [],
        tags: [],
        city_prices: []
      },
      isShowAllCityPrices: false
    }
  },
  methods: {
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //返回加价率
    returnMarkup(data){
      return DataHandle.returnMarkup(data);
    },
    //返回下单率
    returnLowerRate(data){
      return DataHandle.returnLowerRate(data);
    },
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //取消
    cancelAddEdit(){
      this.itemItemShowHideDetail({ isShow: false });
    },
    //确认商品上架
    affirmOnGround(){
      let that = this;
      MessageBox.confirm('确认上架？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { detail } = that;
        that.itemItemOnGround({
          data: { id: detail.id },
          callback: ()=>{
            that.cancelAddEdit();
            that.$attrs.callback();//回调
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    //确认商品下架
    affirmUnderGround(){
      let that = this;
      MessageBox.confirm('确认下架？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { detail } = that;
        that.itemItemUnderGround({
          data: { id: detail.id },
          callback: ()=>{
            that.cancelAddEdit();
            that.$attrs.callback();//回调
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    //确认商品审核
    affirmApprove(d){
      let that = this;
      MessageBox.confirm('确认通过审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { detail } = that;
        that.itemItemStatusApprove({
          data: { id: detail.id },
          callback: ()=>{
            that.cancelAddEdit();
            that.$attrs.callback();//回调
          }
        });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    ...mapActions(['itemItemShowHideDetail', 'itemItemOnGround', 'itemItemUnderGround', 'itemItemStatusApprove'])
  },
  watch:{
    itemItemDetail: {
      deep: true,
      handler: function (a, b) {
        let that = this;
        let rd = JSON.parse( JSON.stringify( a ) );
        if(rd.id){
          rd.price_buy_temp = that.returnPrice(rd.price_buy);
          rd.price_sale_temp = that.returnPrice(rd.price_sale);
          rd.markup_rate_temp = that.returnMarkup(rd.markup_rate);
          rd.price_origin = that.returnPrice(rd.price_origin);
          rd.city_prices = rd.city_prices.map(item => {
            item.percent = that.returnMarkup(item.percent);
            item.price_sale_piece = that.returnPrice(item.price_sale_piece);
            return item;
          });
          rd.gross_weight_temp = that.returnWeight(rd.gross_weight);
          rd.net_weight_temp = that.returnWeight(rd.net_weight);
        }

        that.$data.detail = Object.assign({}, that.$data.detail, rd);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .item-detail {
    .subtitle{
      color: #5A5D64;
      font-size: 14px;
    }
    .detail{
      color: #5A5D64;
      font-size: 14px
    }
    .img-div{
      overflow: hidden;
      background: #fff;
      >img{
        width: 64px;
        height: 64px;
        margin-right: 10px;
      }
    }
    .label{
      height: 50px
    }
    .my-quill-editor-detail img {
      width: 480px;
      height: auto;
    }
  }
</style>
