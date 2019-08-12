<template>
  <el-dialog :close-on-click-modal="false" title="修改分类/外标签" :visible="isShow" width="720px" :before-close="handleCancel">
    <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="展示分类" prop="display_class_code">
          <select-display-class :isUseToQuery="true" v-model="detail.display_class_code"/>
        </el-form-item>
        <el-form-item label="选择商品标签">
          <div class="label pre">
            <el-tag :type="judgeTag(item.title) ? 'danger' : 'info'" v-for="(item, index) in itemTags" :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="clickTag(item.title)">{{item.title}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectDisplayClass } from '@/common';

export default {
  name: "FormItemListEditClassTag",
  mixins: [formMixin],
  components: {
    'select-display-class': SelectDisplayClass
  },
  created() {
    this.baseItemTagsList();//商品标签列表
  },
  data(){
    let initDetail = {
      display_class_code: '',
      tags: []
    }
    return{
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
      itemTags: [],
      rules: {
        display_class_code: [
            { required: true, message: '请选择展示分类', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //选择商品标签
    clickTag(tag){
      let that = this;
      let { detail } = that;
      if(detail.tags.length === 0){
        detail.tags.push(tag);
      }else{
        for(let i = 0; i < detail.tags.length; i++){
          if(detail.tags[i] === tag){
            detail.tags.remove(i);
            break;
          }
          if(i === detail.tags.length - 1){
            detail.tags.push(tag);
            break;
          }
        }
      }
      that.$data.detail = detail;
      that.$forceUpdate(); //强制渲染
    },
    //判断是否选择tag
    judgeTag(tag){
      let that = this;
      let { detail } = that;
      for(let i = 0; i < detail.tags.length; i++){
        if(detail.tags[i] === tag){
          return true;
        }
      }
      return false;
    },
    //获取商品标签列表
    async baseItemTagsList(){
      let that = this;
      let res = await Http.get(Config.api.baseItemTagsList, {});
      if(res.code === 0){
        that.$data.itemTags = res.data;
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //提交
    async submitData(){
      let { detail, itemTags } = this;
      // 检查提交的标签中是否含有不在标签列表中的标签
      let tmpTags = Array();
      for (let i = 0; i < itemTags.length; i++) {
        tmpTags.push(itemTags[i].title);
      }
      let removeTags = Array();
      for (let i = 0; i < detail.tags.length; i++) {
        if (!tmpTags.includes(detail.tags[i])) {
          removeTags.push({id: i, tag: detail.tags[i]})
        }
      }
      for (let i = 0; i < removeTags.length; i++) {
        detail.tags.remove(removeTags[i].id)
      }

      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemOutEdit, {
        id: detail.id,
        display_class_code: detail.display_class_code,
        tags: detail.tags
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemList');
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
</style>
