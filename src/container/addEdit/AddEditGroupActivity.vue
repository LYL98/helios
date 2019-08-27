<template>
  <el-dialog :title="`${detail.id?'修改':'新增'}商品`" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
    <el-form class="custom-form" label-position="right" label-width="110px" style="width: 95%" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle" style="padding-bottom: 16px">基本信息</h6>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="商品封面" prop="cover_image">
            <upload-img v-model="detail.cover_images" module="groupBuy" :limit="1"/>
            <div style="color: #999; font-size: 12px;">建议上传图片尺寸 2 : 1</div>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="商品轮播图" prop="images">
            <upload-img v-model="detail.images" module="item" :limit="5"></upload-img>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品编号" v-if="detail.code">{{detail.code}}</el-form-item>
      <el-form-item label="商品名称" prop="title">
        <el-input size="medium" v-model="detail.title" :maxLength="25" placeholder="请输入25位以内的字符"></el-input>
      </el-form-item>
      <el-form-item label="商品详情">
        <quill-editor v-model="detail.content" module="item"></quill-editor>
      </el-form-item>

      <h6 class="subtitle" style="padding-bottom: 16px">价格信息</h6>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="原价" prop="price_origin">
            <el-input size="medium" v-model="detail.price_origin" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="建议团长价" prop="advice_header_price">
            <el-input size="medium" v-model="detail.advice_header_price" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="建议团购价" prop="advice_price_sale">
            <el-input size="medium" v-model="detail.advice_price_sale" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <h6 class="subtitle" style="padding-bottom: 16px">分享信息</h6>
      <el-form-item label="分享文案" prop="share_content">
        <el-input size="medium" v-model="detail.share_content" :maxlength="30" placeholder="请输入团购商品分享文案"></el-input>
      </el-form-item>
      <el-form-item label="分享图片" prop="share_content">
        <upload-img v-model="detail.share_images" module="share_images" :limit="5"></upload-img>
        <div style="color: #999; font-size: 12px;">上传图片尺寸为 5 : 4</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { QuillEditor, UploadImg } from '@/common';

export default {
  name: "AddEditGroupActivity",
  mixins: [addEditMixin],
  components: {
    'upload-img': UploadImg,
    'quill-editor': QuillEditor
  },
  data(){
    //价格
    let validPriceSale = (rules, value, callback) => {
      if (Number(value) > 1000000) {
        callback('金额不能超过1000000')
      }else {
        callback();
      }
    };
    //建议团购价
    let validAdvicePriceSale = (rules, value, callback) => {
      if (Number(value) < Number(this.detail.advice_header_price)) {
        callback('建议团购价不能小于建议团长价')
      }else {
        callback();
      }
    };
    let initDetail = {
      cover_images: [],
      cover_image: '', //封面图片
      images: [], //轮播图片
      title: '', //参加团购活动的商品名称
      content: '', //商品详情
      price_origin: '', //原价
      advice_header_price: '', //建议团长价
      advice_price_sale: '', //建议团购价
      share_content: '', //分享文案
      share_images: [],
      share_image: '', //分享图片
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        cover_images: [
          { type: 'array', required: true, message: '请上传图片', trigger: 'change' }
        ],
        images: [
          { type: 'array', required: true, message: '至少要上传一张图片', trigger: 'change' }
        ],
        title: [
          { required: true, message: '商品名称不能为空', trigger: 'change' },
        ],
        price_origin: [
          { required: true, message: '请输入原价', trigger: 'change' },
          { pattern: Verification.testStrs.isPrice, message: '请输入正确的价格', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
        ],
        advice_header_price: [
          { required: true, message: '请输入建议团长价', trigger: 'change' },
          { pattern: Verification.testStrs.isPrice, message: '请输入正确的价格', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
        ],
        advice_price_sale: [
          { required: true, message: '请输入建议团购价', trigger: 'change' },
          { pattern: Verification.testStrs.isPrice, message: '请输入正确的价格', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
          { validator: validAdvicePriceSale, trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        this.groupItemDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async groupItemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupItemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = {
          ...rd,
          cover_images: this.handleToArray(rd.cover_image),
          share_images: this.handleToArray(rd.share_image),
          price_origin: this.returnPrice(rd.price_origin),
          advice_header_price: this.returnPrice(rd.advice_header_price),
          advice_price_sale: this.returnPrice(rd.advice_price_sale),
        };
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'groupItemEdit' : 'groupItemAdd'], {
        ...detail,
        cover_image: this.returnArrayIndex(detail.cover_images, 0),
        share_image: this.returnArrayIndex(detail.share_images, 0),
        price_origin: this.handlePrice(detail.price_origin),
        advice_header_price: this.handlePrice(detail.advice_header_price),
        advice_price_sale: this.handlePrice(detail.advice_price_sale),
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableGroupItem');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
