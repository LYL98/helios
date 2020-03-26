<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'修改':'新增'}商品标签`" :visible="isShow" width="720px" :before-close="handleCancel">
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
        <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { Avatar } from '@/common';

export default {
  name: "AddEditItemTags",
  mixins: [addEditMixin],
  components: {
    'my-avatar': Avatar
  },
  props: {
    provinceCode: { type: String, default: '' }, //省code
  },
  data(){
    return{
      initDetail: {
        province_code: this.provinceCode,
        image:[],
      },
      images: [],
      choseImg: '',
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
  created() {
    //this.basicdataItemTagsIcons();
    if(this.images.length){
      // this.detail.image_id = this.images[0].id
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
    //获取icons
    async basicdataItemTagsIcons() {
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.basicdataItemTagsIcons, {});
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.images = res.data;
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //取消
    handleCancel(){
      if(this.detail.image.length) this.$refs.upload.handleRemove(Config.tencentPath+this.detail.image)
      this.reset();
      this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.$data.isShow = false;
    },
    //显示新增修改(重写)
    async showAddEdit(data){
      this.basicdataItemTagsIcons(); //获取icons
      if(data){
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.basicdataItemTagsDetail, { id: data.id });
        this.$loading({isShow: false});
        if(res.code === 0){
          let rd = res.data;
          rd.image = rd.image.split();
          if(rd.image[0]) {
            this.icon_check = -1;
          }
          this.$data.detail = JSON.parse(JSON.stringify(rd));
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$data.isShow = true;
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
      }
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
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

      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataItemTagsEdit' : 'basicdataItemTagsAdd'], req);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemTags');
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
