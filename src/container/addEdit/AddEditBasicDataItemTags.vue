<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}商品标签`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入4位以内的字符" :maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>
        <el-form-item label="上传ICON">
          <my-avatar style="height:64px; margin-top: 15px" :notShowView="true" :avatar="true" ref="upload"  :checked="icon_check == -1" @change="changeIcon" v-model="detail.image" module="itemTags" :limit="1"></my-avatar>
        </el-form-item>
        <el-form-item label="默认ICON">
          <ul class="icons">
            <li v-for="(item,index) in images" :key="index" @click="checkd_icon(index,item)">
              <i class="el-icon-circle-check" v-show="icon_check == index" ></i>
              <img :src="tencentPath +item.image" />
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="submitAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { UploadImg, Avatar } from '@/common';

export default {
  name: "AddEditItemTags",
  mixins: [addEditMixin],
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'my-avatar': Avatar
  },
  computed: mapGetters({
    isShow: 'basicDataItemTagsIsShowAddEdit',
    images: 'basicdataItemTagsIcons',
    basicDataItemTagsDetail: 'basicDataItemTagsDetail'
  }),
  created() {
    //this.basicdataItemTagsIcons();
    if(this.images.length){
      // this.detail.image_id = this.images[0].id
    }
  },
  data(){

    return{
      tencentPath: Config.tencentPath,
      detail: {
        image:[],
      },
      choseImg:'',
      icon_check: 0,
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    changeIcon(){
      if(this.detail.image.length) {
        this.icon_check = -1;
      }else{
        this.icon_check = 0;
      }
    },
    checkd_icon(index,item){
      if(index != this.icon_check){
        this.icon_check = index;
        this.choseImg = item.image;
      }else if( index == this.icon_check && this.detail.image.length ){
        this.icon_check = -1;
        this.choseImg = "";
      }
    },
    reset() {
      this.icon_check = 0;
      this.choseImg = "";
    },
    //取消
    handleCancel(){
      this.basicDataItemTagsShowHideAddEdit({ isShow: false });
      if(this.detail.image.length)this.$refs.upload.handleRemove(Config.tencentPath+this.detail.image)
      this.reset();
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
        this.$data.detail.id = '';
      },0);
    },

    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          let req = JSON.parse(JSON.stringify(detail));
          if(req.image && typeof req.image != 'string') {
            req.image = req.image.join();
          }
          // else{
          //   req.image = req.image.length ? req.image : this.images[0].image;
          // }

          if(this.choseImg) {
            req.image = this.choseImg;
          }else if(!this.choseImg && !req.image[0]) {
            req.image = this.images[0].image
          }

          that.basicDataItemTagsAddEdit({
            data: req,
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.handleCancel();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['basicDataItemTagsShowHideAddEdit', 'basicDataItemTagsAddEdit'])
  },
  watch:{
    basicDataItemTagsDetail: {
      deep: true,
      handler: function (c, b) {
        let a = c || b;
        if(a.id) {
          this.detail = JSON.parse( JSON.stringify( a ) );
          this.detail.image = this.detail.image.split();
          if(this.detail.image[0]) {
            this.icon_check = -1;
          }
        }
      }
    },
    detail(a, b) {
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icons{
  display: flex;
  flex-wrap: wrap;
}
.icons li{
  margin:0 20px 10px 0;
  height: 64px;
  position: relative;
  cursor: pointer;
}
.icons li:nth-child(6n) {
  margin-right: 0px;
}
.icons li i{
  position: absolute;
  color: #0bf014;
  font-size: 24px;
  right: 0;
}
.icons li img{
  width: 64px;
  border-radius: 3px;
}
</style>
