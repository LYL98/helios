<template>
  <el-dialog title="商品详情" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel">
      <div class="item-detail">
          <el-form class="custom-form-detail" label-position="right" label-width="100px" style="width: 1100px;">
            <h6 class="subtitle" style="padding-bottom: 16px">基本信息</h6>
            <el-row :gutter="10">
              <el-col :span="6">
                <dl class="detail-item">
                  <dt class="label">商品封面</dt>
                  <dd class="content">
                    <image-preview>
                      <img style="width: 64px; height: 64px;" :src="tencentPath + detail.cover_image + '_min200x200'" alt=""/>
                    </image-preview>
                  </dd>
                </dl>
              </el-col>
              <el-col :span="18">
                <dl class="detail-item">
                  <dt class="label">商品轮播图</dt>
                  <dd class="content">
                    <image-preview>
                      <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
                    </image-preview>
                  </dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 20px;">
              <el-col :span="6">
                <dl class="detail-item">
                  <dt class="label">商品编号</dt>
                  <dd class="content">{{detail.code}}</dd>
                </dl>
              </el-col>
              <el-col :span="18">
                <dl class="detail-item">
                  <dt class="label">商品名称</dt>
                  <dd class="content">{{detail.title}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">商品详情</dt>
                  <dd class="content">
                    <div class="content-div" v-html="detail.content"></div>
                  </dd>
                </dl>
              </el-col>
            </el-row>

            <h6 class="subtitle" style="padding-bottom: 16px">价格信息</h6>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">原价</dt>
                  <dd class="content">{{ detail.price_origin ? '￥' : '' }}{{returnPrice(detail.price_origin)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">建议团长价</dt>
                  <dd class="content">{{ detail.advice_header_price ? '￥' : '' }}{{returnPrice(detail.advice_header_price)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">建议团购价</dt>
                  <dd class="content">{{ detail.advice_price_sale ? '￥' : '' }}{{returnPrice(detail.advice_price_sale)}}</dd>
                </dl>
              </el-col>
            </el-row>

            <h6 class="subtitle" style="padding-bottom: 16px">分享信息</h6>
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">分享文案</dt>
                  <dd class="content">{{detail.share_content || '-'}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">分享图片</dt>
                  <dd class="content">
                    <image-preview>
                      <img style="width: 64px; height: 64px;" :src="tencentPath + detail.share_image + '_min200x200'" alt=""/>
                    </image-preview>
                  </dd>
                </dl>
              </el-col>
            </el-row>
          </el-form>
        </div>
    </el-dialog>
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
      images: []
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //显示新增修改(重写mixin)
    showDetail(data){
      if(data){
        this.GroupItemDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async GroupItemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupItemDetail, { id: id });
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
<style lang="scss" scoped>
  .item-detail {
    padding-left: 10px;
    .subtitle{
      color: #5A5D64;
      font-size: 14px;
    }
    .detail-item {
      display: flex;
      >.label {
        color: #606266;
        width: 100px;
        line-height: 20px;
        text-align: right;
        margin-right: 10px;
        height: 50px
      }
      >.content {
        padding-right: 20px;
        flex: 1;
        word-break: break-all;
        line-height: 20px;
      }
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
    .my-quill-editor-detail img {
      width: 480px;
      height: auto;
    }
  }

  .content-div{
    width: 948px;
    height: 360px;
    border: 1px solid #ececec;
    overflow-y: auto;
    padding: 0 10px;
  }
</style>
