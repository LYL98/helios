<template>
  <el-dialog :close-on-click-modal="false" :title="`${pageTitles[pageType]}Banner`" :visible="isShow" width="840px" :before-close="handleCancel">
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
        <my-search-item v-model="itemName" @onSelectItem="selectItem" :provinceCode="$province.code"></my-search-item>
      </el-form-item>
      <el-form-item label="商品类型" v-if="bannerType === 'category'">
        <my-select-tag :tag="tagName" @change="selectTag"></my-select-tag>
      </el-form-item>
      <el-form-item label="选择展示分类" v-if="bannerType === 'displayClass'">
        <my-select-display-class style="width: 200px" v-model="displayId" @change="selectDisplayUrl"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from '@/container/addEdit/add.edit.mixin';
import { Config, Verification, Http } from '@/util';
import { SearchItem, UploadImg, SelectDisplayClass, SelectTag } from '@/common'

export default {
  name: "AddEdit",
  mixins: [addEditMixin],
  components: {
    'my-select-display-class': SelectDisplayClass,
    'my-search-item': SearchItem,
    'my-upload-img': UploadImg,
    'my-select-tag': SelectTag
  },
  created: function() {

  },
  data(){
    let initDetail = {
      province_code: '',
      images: [],
      url: '',
      is_usable: true,
      type: '',
    };
    return{
      upData: {
        domain: '',
        token: '',
        key: ''
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        images: [
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
      displayId: '',
      bannerType: 'nolink',
      itemName: ''
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data, type){
      this.$data.pageType = type;
      if(type === 'edit'){
        let detail = this.copyJson(data);
        this.linkName(detail.url, type => this.bannerType = type);
        detail.images = detail.image !== '' ? [detail.image] : [];
        this.$data.detail = detail;
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      this.$data.isShow = true;
    },
    selectItem(item) {
      let { detail } = this;
      detail.url = '/pages/itemDetail/itemDetail?id=' + item.id;
    },
    selectTag(tag) {
      let { detail } = this;
      detail.url = '/pages/itemLabel/itemLabel?tag=' + tag;
    },
    selectDisplayUrl(id) {
      let { detail } = this;
      detail.url = "app://itemList/" + id;
    },
    linkName(url, callback) {
      let that = this;
      that.$data.urlName = '';
      that.$data.itemName = '';
      that.$data.displayId = '';

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
        that.$data.displayId = id;
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
    async baseItemDetail(id, callback) {
      let res = await Http.get(Config.api.baseItemDetail, { id: id });
      if (res.code === 0) {
        let rd = res.data;
        callback(rd)
      }
    },
    async baseDisplayClassList(code, callback) {
      let res = await Http.get(Config.api.baseDisplayClassList, {
        province_code: this.$province.code,
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
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      if (this.bannerType === 'nolink') {
        detail.url = ''
      }
      if (detail.images.length === 1) {
        detail.image = detail.images[0]
      } else {
        this.$message({message: '请上传图片', type: 'error'});
        return false
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'edit' ? 'systemBannerEdit' : 'systemBannerAdd'], {
        ...detail,
        province_code: this.$province.code
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${pageType === 'edit' ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('Table');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
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
