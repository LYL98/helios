<template>
  <div>
    <el-dialog title="编辑商品标签" :visible="isShow" width="720px" :before-close="cancelAddEdit" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" style="width: 600px;">
        <el-form-item label="选择商品标签">
          <div class="label pre">
            <el-tag :type="judgeTag(item.title) ? 'danger' : 'info'" v-for="(item, index) in itemTags" :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="clickTag(item.title)">{{item.title}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAddEdit">取 消</el-button>
        <el-button type="primary" @click.native="submitAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Button, MessageBox, Dialog, Tag } from "element-ui";
import { Config, DataHandle } from '@/util';
import { Item, Base } from '@/service';

export default {
  name: "ItemPricing",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-dialog': Dialog,
    'el-tag': Tag,
  },
  created() {
    let that = this;
    that.baseItemTagsList();//商品标签列表
  },
  computed: mapGetters({
    isShow: 'itemItemIsShowEditTags',
    itemItemDetail: 'itemItemDetail'
  }),
  data(){
    return {
      itemTags: [], //商品标签
      detail: {
        tags: []
      }
    }
  },
  methods: {
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price){
      return DataHandle.handlePrice(price);
    },
    //返回重量
    returnWeight(data){
      return DataHandle.returnWeight(data);
    },
    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },
    //返回加价率
    returnMarkup(data){
      return DataHandle.returnMarkup(data);
    },
    //处理加价率
    handleMarkup(data){
      return DataHandle.handleMarkup(data);
    },
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
      let res = await Base.baseItemTagsList();
      if(res.code === 0){
        that.$data.itemTags = res.data;
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //取消
    cancelAddEdit(){
      this.itemItemShowHideEditTags({ isShow: false });
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      let { detail, itemTags } = that;
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
      that.itemItemTagsEdit({
        data: {
          id: detail.id,
          tags: detail.tags
        },
        callback: (res)=>{
          this.$attrs.callback();
          that.cancelAddEdit();
        }
      });
    },
    ...mapActions(['itemItemShowHideEditTags', 'itemItemTagsEdit'])
  },
  watch:{
    itemItemDetail: {
      deep: true,
      handler: function (a, b) {
        let that = this;
        let rd = JSON.parse( JSON.stringify( a ) );
        this.detail = rd;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .img-div{
    overflow: hidden;
    .img-item{
      float: left;
      width: 64px;
      height: 64px;
      margin-right: 10px;
      position: relative;
      >img{
        width: 64px;
        height: 64px;
      }
      .img-del{
        position: absolute;
        right: 0;
        top: 0;
        background: #ff5252;
        color: #fff;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        font-size: 14px;
      }
    }
    .add-btn{
      float: left;
      border: 1px dashed #999;
      width: 62px;
      height: 62px;
      color: #999;
      text-align: center;
      line-height: 62px;
      font-size: 32px;
      position: relative;
    }
    .add-btn > input{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      opacity: 0;
    }
  }


  .display-class-item{
    border-bottom: 1px solid #f3f4f6;
    padding: 10px;
  }

  .system-class{
    width: 500px;
    .select-div{
      border-bottom: 1px solid #f3f4f6;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      span{
        display: inline-block;
        margin-left: 5px;
        background: #f3f4f6;
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
        &.select{
          color: #999;
        }
      }
    }
    .content{
      width: 500px;
      top: 82px;
      .not-data{
        font-size: 14px;
        text-align: center;
        margin-top: 32px;
        color: #999;
      }
    }
    .bottom{
      width: 480px;
    }
  }
</style>
