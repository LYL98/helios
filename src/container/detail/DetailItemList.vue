<template>
  <div>
    <el-dialog title="商品详情" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
      <el-form class="custom-form" label-position="right" label-width="110px" style="width: 98%" :model="detail">
        <el-row :gutter="10">
          <el-col :span="22">
            <el-form-item label="商品图片">
              <image-preview>
                <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
              </image-preview>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button @click.native="handleShowEditRecord" v-if="auth.isAdmin || auth.ItemListEditRecord">修改明细</el-button>
          </el-col>
        </el-row>
        <h6 class="subtitle" style="padding-bottom: 16px">基本信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商品名称">{{detail.title}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="框">
              <span v-if="detail.frame_code">{{detail.frame.title}}&nbsp;(&yen;{{returnPrice(detail.frame.price)}})</span>
              <span v-else>-</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产地">{{detail.origin_place}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="包装规格">{{detail.package_spec}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格">{{detail.item_spec}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毛重">{{returnWeight(detail.gross_weight)}}斤</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="净重">{{returnWeight(detail.net_weight)}}斤</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="科学分类">{{detail.system_class.title}}</el-form-item>
          </el-col>
        </el-row>
        <h6 class="subtitle" style="padding-bottom: 16px">销售信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购价">&yen;{{returnPrice(detail.price_buy)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售价">&yen;{{returnPrice(detail.price_sale)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价">&yen;{{returnPrice(detail.markup_rate)}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="原价">&yen;{{returnPrice(detail.price_origin)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="展示分类">{{detail.display_class.title}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大订货数量">{{detail.order_num_max}}件</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="库存">{{detail.item_stock}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序">{{detail.rank}}</el-form-item>
          </el-col>
          <el-col :span="8" v-if="!detail.frame_code">
            <el-form-item label="是否赠品">{{detail.is_gift ? '是' : '否'}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item v-if="!detail.is_gift" label="是否预售">{{detail.is_presale ? '是' : '否'}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="!detail.is_gift && detail.is_presale" label="配送日期">{{detail.presale_date}}</el-form-item>
          </el-col>
        </el-row>
        <h6 class="subtitle" style="padding-bottom: 16px">其他信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="内标签">
              <select-inner-tag v-model="detail.inner_tag_id"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品详情">
          <div class="content-div" v-html="detail.content"></div>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="第一次上架人">{{detail.first_grounder.realname}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="创建时间">{{detail.created}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="最后更新人">{{detail.last_updater.realname || detail.first_grounder.realname}}</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="最后更新时间">{{detail.updated}}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div style="float: right">
            <el-button @click.native="handleCancel">取 消</el-button>
            <el-button type="primary" @click.native="handleAddEdit">确 认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import detailMixin from './detail.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { ImagePreview } from  '@/common'

export default {
  name: "DetailItemList",
  mixins: [detailMixin],
  components: {
    'image-preview': ImagePreview,
  },
  created() {
  },
  data(){
    let initDetail = {
      images: [],
      is_weigh: true,
      price_origin: '',
      markup_rate_temp: 10,
      inner_tag_id: '',
      tags: [],
      content: '',
      is_presale: false,
      is_gift: false,
      order_num_max: 999,
      display_class: {},
      frame: {},
      system_class: {},
      first_grounder: {},
      last_updater: {}
    }
    return {
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
    }
  },
  methods: {
    //显示新增修改(重写mixin)
      showDetail(data){
        if(data){
          this.itemDetail(data.id);
        }else{
          this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
          this.$data.isShow = true;
        }
      },
      //显示修改明细
      handleShowEditRecord(){
        let pc = this.getPageComponents('DetailItemListEditRecord');
        pc.showDetail(this.detail);
      },
    //获取详情
    async itemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
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
  .content-div{
    height: 200px;
    border: 1px solid #ececec;
    overflow-y: auto;
    padding: 0 10px;
  }
</style>
