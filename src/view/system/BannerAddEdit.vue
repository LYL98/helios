<template>
  <div class="banner-add-edit">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}Banner`" :visible="isShowAddEdit" width="840px" :before-close="cancelAddEdit">
      <el-form label-position="right" label-width="120px" style="width: 700px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="图片" prop="images">
          <my-upload-img v-model="detail.images" module="banner" :limit="1"></my-upload-img>
        </el-form-item>
        <el-form-item label="是否可用">
           <el-radio-group v-model="detail.is_usable">
            <el-radio :label="true">可用</el-radio>
            <el-radio :label="false">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" placeholder="0 - 999" :maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="商品链接">
          <el-radio-group v-model="bannerType">
            <el-radio label="commdity">链接到商品</el-radio>
            <el-radio label="category">链接到品类</el-radio>
            <el-radio label="displayClass">链接到展示分类</el-radio>
            <el-radio label="nolink">没有链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择商品" v-if="bannerType === 'commdity'">
          <my-search-item v-model="itemName" @onSelectItem="selectItem"></my-search-item>
        </el-form-item>
        <el-form-item label="商品类型" v-if="bannerType === 'category'">
          <my-select-tag :tag="tagName" @change="selectTag"></my-select-tag>
        </el-form-item>
        <el-form-item label="选择展示分类" v-if="bannerType === 'displayClass'">
          <my-select-display-class style="width: 200px" v-model="displayCode" @change="selectDisplayUrl"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAddEdit">取 消</el-button>
        <el-button type="primary" @click.native="submitBannerAddEdit()" :loading="loading.isShow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, Input, Message, Dialog, RadioGroup, Radio, Select, Option, Upload } from "element-ui";
import { Config, Verification } from '@/util';
import { Base } from '@/service';
import { SearchItem, UploadImg, SelectDisplayClass, SelectTag } from '@/common'

export default {
  name: "bannerAddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'el-select': Select,
    'el-option': Option,
    'el-upload': Upload,
    'my-select-display-class': SelectDisplayClass,
    'my-search-item': SearchItem,
    'my-upload-img': UploadImg,
    'my-select-tag': SelectTag
  },
  computed: mapGetters({
    loading: 'loading',
    isShowAddEdit: 'bannerIsShowAddEdit',
    bannerDetail: 'bannerDataDetail',
    province: 'globalProvince'
  }),
  created: function() {

  },
  data(){
    let validImages = function(rules, value, callback) {
      // console.log('value: ' + JSON.stringify(value));
      if (value.length && value.length > 0) {
        callback();
      } else {
        callback(new Error('请上传图片'));
      }
    };

    return{
      tencentPathUp: Config.tencentUpPath,
      tencentPath: Config.tencentPath,
      upData: {
        domain: '',
        token: '',
        key: ''
      },
      detail: {
        images: [],
        url: '',
        is_usable: true,
        type: ''
      },

      rules: {
        images: [
          //{ validator: validImages, trigger: 'change' },
          { required: true, type: 'array', message: '请上传图片', trigger: 'change' }
        ],
        rank: [
          { required: false},
          { pattern: Verification.testStrs.isNumber, message: '排序值必须为整数', trigger: 'blur' },
        ]
      },
      urlName: '',
      tagName: '',
      displayClassUrl: '',
      displayCode: '',
      bannerType: '',
      itemName: ''
    }
  },
  methods: {
    selectItem(item) {
      let { detail } = this;
      detail.url = '/pages/itemDetail/itemDetail?id=' + item.id;
    },
    selectTag(tag) {
      let { detail } = this;
      detail.url = '/pages/itemLabel/itemLabel?tag=' + tag;
    },
    selectDisplayUrl(code) {
      let { detail } = this;
      detail.url = "app://itemList/" + parseInt(code);
    },
    linkName(url, callback) {
      let that = this;
      that.$data.urlName = '';
      that.$data.itemName = '';
      that.$data.displayCode = '';

      let bannerType = '';

      if (url.includes("/pages/itemDetail")) {
        bannerType = 'commdity';
        //商品详情id解析
        let itemId = String(url.match(/id=\d+/)).substring(3);
        this.baseItemDetail(itemId, item => {
          that.$data.itemName = item.title;
          callback(bannerType);
        })
      } else if (url.includes('app://itemList')) {
        //展示分类
        bannerType = 'displayClass';
        let id = parseInt(String(url.match(/\d+/)));
        let codeStr = '';
        if (id < 10) {
          codeStr = '0' + id
        } else {
          codeStr = '' + id
        }
        that.$data.displayCode = codeStr;
        callback(bannerType);
      } else if (url.includes("/pages/itemLabel")) {
        bannerType = 'category';
        //标签名称解析
        that.$data.tagName = String(url.match(/tag=.+/)).substring(4);
        callback(bannerType)
      } else {
        bannerType = 'nolink';
        callback(bannerType);
      }
    },
    //取消
    cancelAddEdit(){
      this.$refs['ruleForm'].resetFields();
      this.systemBannerShowHideAddEdit({
          isShow: false
      });
    },
    async baseItemDetail(id, callback) {
      let res = await Base.baseItemDetail({
        id: id
      });
      if (res.code === 0) {
        let rd = res.data;
        callback(rd)
      }
    },
    async baseDisplayClassList(code, callback) {
      let res = await Base.baseDisplayClassList({
        code: code
      });
      if (res.code === 0) {
        let rd = res.data;
        callback(rd)
      }
    },
    //上传前
    // beforeAvatarUpload(){
    //
    // },
    submitBannerAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;

          if (that.bannerType === 'nolink') {
            detail.url = ''
          }
          if (detail.images.length === 1) {
            detail.image = detail.images[0]
          } else {
            Message({
              showClose: true,
              message: '请上传图片',
              type: 'error'
            });
            return false
          }
          that.systemBannerAddEdit({
            data: {
              ...detail,
              province_code: that.province.code
            },
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.cancelAddEdit();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['systemBannerAddEdit', 'systemBannerShowHideAddEdit']),
  },
  watch:{
    bannerDetail: {
      deep: true,
      handler: function (a, b) {
        let { detail } = this;
        let d = JSON.parse( JSON.stringify( a ) );
        this.linkName(d.url, type => this.bannerType = type);
        if (d.id && d.image && d.image !== '') {
          detail.images = [d.image];
        }else{
          detail.images = [];
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 135px;
    line-height: 135px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar {
    width: 180px;
    height: 135px;
    display: block;
  }
</style>
