<template>
  <el-form label-position="right" label-width="100px" style="width: 620px;">
    <el-form-item label="等级">
      <el-tag disable-transitions :type="gradeTagData.grade_code === item.code ? 'danger' : 'info'" v-for="(item, index) in gradeList"
              :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="selectGrade(item)">
        {{item.title}}
      </el-tag>
    </el-form-item>
    <el-form-item label="内标签">
      <div v-for="(item, index) in innerTags" :key="index">
        <div style="height: 30px;">{{item.title}}</div>
        <div>
          <el-tag disable-transitions :type="judgeInnerTag(c) ? 'danger' : 'info'" v-for="(c, i) in item.child_tags" :key="i"
            style="margin-right: 5px;cursor:pointer;" @click.native="selectInnerTags(item, c)">
            {{c.title}}
          </el-tag>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="外标签">
      <el-tag disable-transitions :type="judgeOuterTag(item) ? 'danger' : 'info'" v-for="(item, index) in outerTags"
              :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="selectOuterTag(item)">
        {{item.title}}
      </el-tag>
    </el-form-item>
    <el-form-item style="text-align: right;">
      <el-button @click="cancelTag">取消</el-button>
      <el-button @click="merchantGradeTagsEdit" :loading="isSending" type="primary">确定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { Form, FormItem, Tag, Button } from 'element-ui';
import { Http, Config } from '@/util';

export default {
  name: 'TagsEdit',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-tag': Tag,
    'el-button': Button
  },
  props: {
    merchantDetail: Object,
    cancelTag: Function,
    affirmTag: Function,
  },
  data() {
    return {
      isSending: false,
      gradeList: [], //等级
      innerTags: [], //内标签
      outerTags: [], //外标签
      gradeTagData: {}, // 商户等级对象
    }
  },
  created() {
    // 获取所有标签
    let data = JSON.parse(JSON.stringify(this.merchantDetail)); //破坏原型链，防止修改未保存外层变化
    this.showTag(data);
  },
  methods: {
    /**
     * 响应 【修改等级、标签】的按钮事件。接受一个参数：商户对象
     */
    showTag(data) {
      this.baseMerchantInnerTagsList();//商户内标签
      this.baseMerchantOuterTagsList();//商户外标签
      this.baseMerchantGradeList();//商户等级列表
      let innerTagIds = [];
      data.inner_tags.forEach(item => {
        innerTagIds.push(item.id);
      });
      let gradeTagData = {
        grade_code: data.grade_code,
        inner_tag_ids: innerTagIds,
        outer_tags: data.outer_tags
      }
      this.$data.gradeTagData = gradeTagData;
    },

    /**
     * 获取可以添加给商户的 内标签
     */
    async baseMerchantInnerTagsList() {
      let that = this;
      let res = await Http.get(Config.api.baseMerchantInnerTagsList, {});
      if (res.code === 0) {
        that.$data.innerTags = res.data;
      } else {
       this.$message({ message: res.message, type: 'error' });
      }
    },
    /**
     * 获取可以添加给商户的 外标签
     */
    async baseMerchantOuterTagsList(data) {
      let that = this;
      let res = await Http.get(Config.api.baseMerchantOuterTagsList, {});
      if (res.code === 0) {
        that.$data.outerTags = res.data;
      } else {
       this.$message({ message: res.message, type: 'error' });
      }
    },

    //内标签
    judgeInnerTag(data) {
      let tagIds = this.gradeTagData.inner_tag_ids;
      return tagIds.some(item => item === data.id);
    },

    //内标签
    selectInnerTags(data, item){
      let tagIds = this.gradeTagData.inner_tag_ids;
      if (tagIds.length === 0) {
        tagIds.push(item.id);
      } else {
        for (let i = 0; i < tagIds.length; i++) {
          if (item.id === tagIds[i]) {
            tagIds.remove(i);
            break;
          }
          if (i === tagIds.length - 1) {
            tagIds.push(item.id);
            break;
          }
        }
      }
      this.gradeTagData.inner_tag_ids = tagIds;
      this.$data.gradeTagData = this.gradeTagData;
      this.$forceUpdate(); //强制渲染
    },

    //外标签
    judgeOuterTag(data) {
      let d = this.gradeTagData.outer_tags;
      return d.some(item => item === data.title);
    },

    //外标签
    selectOuterTag(data) {
      let d = this.gradeTagData.outer_tags;
      if (d.length === 0) {
        d.push(data.title);
      } else {
        for (let i = 0; i < d.length; i++) {
          if (data.title === d[i]) {
            d.remove(i);
            break;
          }
          if (i === d.length - 1) {
            d.push(data.title);
            break;
          }
        }
      }
      this.gradeTagData.outer_tags = d;
      this.$data.gradeTagData = this.gradeTagData;
      this.$forceUpdate(); //强制渲染
    },

    /**
     * 获取描述等级信息的数据列表
     */
    async baseMerchantGradeList(data) {
      let that = this;
      let res = await Http.get(Config.api.baseMerchantGradeList, {});
      if (res.code === 0) {
        that.$data.gradeList = res.data;
      } else {
       this.$message({ message: res.message, type: 'error' });
      }
    },

    /**
     * 设置等级。接受一个参数，等级对象信息
     */
    selectGrade(data) {
      let { gradeTagData } = this;
      gradeTagData.grade_code = data.code;
      this.$data.gradeTagData = gradeTagData;
    },

    /**
     * 修改商户的 标签和等级 信息
     */
    async merchantGradeTagsEdit() {
      let { gradeTagData, merchantDetail, innerTags, outerTags } = this;

      //去除内标签没有的项
      for(let i = 0; i < gradeTagData.inner_tag_ids.length; i++){
        let judge = false;
        for(let j = 0; j < innerTags.length; j++){
          let con = innerTags[j].child_tags.filter(item => item.id === gradeTagData.inner_tag_ids[i]);
          if(con.length > 0){            
            judge = true;
            break;
          }
        }
        if(!judge){
          gradeTagData.inner_tag_ids.remove(i);
          i = i - 1;
        }
      }

      //去除外标签没有的项
      for(let i = 0; i < gradeTagData.outer_tags.length; i++){
        let con = outerTags.filter(item => item.title === gradeTagData.outer_tags[i]);
        if(con.length === 0){
          gradeTagData.outer_tags.remove(i);
          i = i - 1;
        }
      }

      this.isSending = true;
      let res = await Http.post(Config.api.merchantGradeTagsEdit, {
        id: merchantDetail.id,
        ...gradeTagData
      });
      this.isSending = false;
      if (res.code === 0) {
        this.affirmTag();
      } else {
       this.$message({ message: res.message, type: 'error' });
      }
    },

  }
}
</script>
<style lang="scss" scoped>

</style>
