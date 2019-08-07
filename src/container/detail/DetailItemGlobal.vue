<template>
  <el-dialog title="商品详情" :visible="isShow" width="1200px" top="5vh" :before-close="handleCancel">
    <el-form class="custom-form" label-position="right" label-width="110px" style="width: 98%">
      <el-row :gutter="10">
        <el-col :span="22">
          <el-form-item label="商品图片">
            <image-preview>
              <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
            </image-preview>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button @click.native="handleShowEditRecord" v-if="auth.isAdmin || auth.ItemGlobalEditRecord">修改明细</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="商品名称">{{detail.title}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="框"><span v-if="detail.frame_code">{{detail.frame.title}}&nbsp;(&yen;{{returnPrice(detail.frame.price)}})</span></el-form-item>
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
      
      <el-form-item label="商品详情">
        <div class="content-div" v-html="detail.content"></div>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="创建人">{{detail.creater.realname}}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间">{{detail.created}}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="最后更新人">{{detail.last_updater.realname || detail.creater.realname}}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="最后更新时间">{{detail.updated}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="handleCancel">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';
  import { ImagePreview } from '@/common';

  export default {
    name: "DetailItemGlobal",
    mixins: [detailMixin],
    components: {
      'image-preview': ImagePreview
    },
    data() {
      let initDetail = {
        images: [],
        creater: {},
        last_updater: {},
        system_class: {},
        frame: {}
      }
      return {
        initDetail: initDetail,
        detail: JSON.parse(JSON.stringify(initDetail))
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        if(data){
          this.pItemDetail(data.id);
        }else{
          this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
          this.$data.isShow = true;
        }
      },
      //显示修改明细
      handleShowEditRecord(){
        let pc = this.getPageComponents('DetailItemGlobalEditRecord');
        pc.showDetail(this.detail);
      },
      //获取详情
      async pItemDetail(id){
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.pItemDetail, { id: id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .content-div{
    height: 200px;
    border: 1px solid #ececec;
    overflow-y: auto;
    padding: 0 10px;
  }
</style>
