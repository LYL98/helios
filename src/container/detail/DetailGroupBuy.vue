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
                      <img style="width: 64px; height: 64px;" :src="tencentPath + '123' + '_min200x200'" alt=""/>
                    </image-preview>
                  </dd>
                </dl>
              </el-col>
              <el-col :span="18">
                <dl class="detail-item">
                  <dt class="label">商品轮播图</dt>
                  <dd class="content">
                    <image-preview>
                      <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in [1,2,3,4,5]" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
                    </image-preview>
                  </dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 20px;">
              <el-col :span="6">
                <dl class="detail-item">
                  <dt class="label">商品编号</dt>
                  <dd class="content">{{detail.item_code}}123456</dd>
                </dl>
              </el-col>
              <el-col :span="18">
                <dl class="detail-item">
                  <dt class="label">商品名称</dt>
                  <dd class="content">{{detail.item_title}}</dd>
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
                  <dd class="content">{{ detail.price_sale ? '￥' : '-' }}{{returnPrice(detail.price_sale)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">建议团长价</dt>
                  <dd class="content">{{ detail.price_sale ? '￥' : '-' }}{{returnPrice(detail.price_sale)}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">建议团购价</dt>
                  <dd class="content">{{ detail.price ? '￥' : '-' }}{{returnPrice(detail.price)}}</dd>
                </dl>
              </el-col>
            </el-row>

            <h6 class="subtitle" style="padding-bottom: 16px">分享信息</h6>
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">分享文案</dt>
                  <dd class="content">{{'国；咖啡店几个有朝一日；两地分居过；黑中介艺术硕士 炒你及时反馈杨万里；国'}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <dl class="detail-item">
                  <dt class="label">分享图片</dt>
                  <dd class="content">
                    <image-preview>
                      <img style="width: 64px; height: 64px;" :src="tencentPath + '123' + '_min200x200'" alt=""/>
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
      images: [],
      is_weigh: true,
      price_origin: '',
      inner_tag_id: '',
      inner_tag: {},
      tags: [],
      content: '',
      is_presale: false,
      is_gift: false,
      order_num_max: 999,
      display_class: {},
      frame: {},
      system_class: {},
      first_grounder: {},
      last_updater: {},
      system_classes: []
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //显示新增修改(重写mixin)
    /*showDetail(data){
      if(data){
        this.groupBuyDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },*/
    //显示修改明细
    handleShowEditRecord(){
      let pc = this.getPageComponents('DetailItemListEditRecord');
      pc.showDetail(this.detail);
    },
    //获取详情
    async groupBuyDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupBuyDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //返回科技分类
    returnSystemClass(data){
      let str = '';
      data.forEach(item => {
        str += item.title + ' / ';
      });
      str = str.substring(0, str.length - 1);
      return str;
    }
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

      .label {
        color: #606266;
        width: 80px;
        line-height: 20px;
      }

      .content {
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
    .label{
      height: 50px
    }
    .my-quill-editor-detail img {
      width: 480px;
      height: auto;
    }
  }

  .content-div{
    height: 360px;
    border: 1px solid #ececec;
    overflow-y: auto;
    padding: 0 10px;
  }
</style>
