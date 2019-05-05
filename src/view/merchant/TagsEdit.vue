<template>
  <el-form label-position="right" label-width="100px" style="width: 620px;">
    <el-form-item label="等级">
      <el-tag disable-transitions :type="gradeTagData.grade_code === item.code ? 'danger' : 'info'" v-for="(item, index) in gradeList"
              :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="selectGrade(item)">
        {{item.title}}
      </el-tag>
    </el-form-item>
    <el-form-item label="内标签">
      <el-tag disable-transitions :type="judgeOuterTag(item, 'inner') ? 'danger' : 'info'" v-for="(item, index) in innerTags"
              :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="selectTag(item, 'inner')">
        {{item.title}}
      </el-tag>
    </el-form-item>
    <el-form-item label="外标签">
      <el-tag disable-transitions :type="judgeOuterTag(item, 'outer') ? 'danger' : 'info'" v-for="(item, index) in outerTags"
              :key="index" style="margin-right: 5px;cursor:pointer;" @click.native="selectTag(item, 'outer')">
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
import {Merchant, Base} from '@/service';

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
    this.showTag(this.merchantDetail);
  },
  methods: {
    /**
     * 响应 【修改等级、标签】的按钮事件。接受一个参数：商户对象
     * 1、加载商户等级列表信息
     * 2、加载商户内标签信息
     * 3、加载商户外标签信息
     *
     * 4、设置组件的 selectData属性 为 传递进来的参数 (即：商户对象)
     * 5、设置组件的 gradeTagData属性 为 商户对象的对应信息
     * 6、设置组件的 isShowTag属性 为 true。(即：修改等级、标签 的弹窗 为 显示状态。)
     */
    showTag(data) {
      this.baseMerchantInnerTagsList();//商户内标签
      this.baseMerchantOuterTagsList();//商户外标签
      this.baseMerchantGradeList();//商户等级列表
      // this.$data.selectData = data;
      let gradeTagData = {
        grade_code: data.grade_code,
        inner_tags: data.inner_tags,
        outer_tags: data.outer_tags
      }
      this.$data.gradeTagData = gradeTagData;
    },

    /**
     * 获取可以添加给商户的 内标签
     * 1、请求api
     * 2、将可用的内标签，赋值给组件的 innerTags 属性
     */
    async baseMerchantInnerTagsList() {
      let that = this;
      let res = await Base.baseMerchantInnerTagsList();
      if (res.code === 0) {
        that.$data.innerTags = res.data;
      } else {
        Message.warning(res.message);
      }
    },
    /**
     * 获取可以添加给商户的 外标签
     * 1、请求api
     * 2、将可用的外标签，赋值给组件的 outerTags 属性
     */
    async baseMerchantOuterTagsList(data) {
      let that = this;
      let res = await Base.baseMerchantOuterTagsList();
      if (res.code === 0) {
        that.$data.outerTags = res.data;
      } else {
        Message.warning(res.message);
      }
    },
    /**
     * 判断商户的 标签 是否处于选中状态。接受两个参数：标签对象 和 标签类型
     * 1、根据标签类型，获取商户 已拥有的、该类型的 标签列表
     * 2、判断商户拥有的标签列表中，是否有该标签
     * 3、如果有；返回 true，如果没有：返回false
     */
    judgeOuterTag(data, type) {
      let {gradeTagData} = this;
      let d = type === 'inner' ? gradeTagData.inner_tags : gradeTagData.outer_tags;
      return d.some(item => item === data.title);
      // for(let i = 0; i < d.length; i++){
      //   if(d[i] === data.title){
      //     return true;
      //   }
      // }
      // return false;
    },

    /**
     * 设置商户的标签。接受两个参数：用户选择的标签对象、标签类型
     * 1、根据标签类型，获取该商户 已拥有的 该类型 的标签列表
     * 2、判断用户所选择的标签 是否在标签列表中？ 如果在，则表示取消；如果不在，则表示添加。
     * 3、将新设置的 商户标签描述对象 重新赋值给 组件的 gradeTagData
     * 4、强制组件重新渲染 UI
     */
    selectTag(data, type) {
      let that = this;
      // gradeTagData 是 商户拥有的标签描述对象。
      // 该对象的数据结构为：{ grade_code: "", inner_tags: [], outer_tags: [] }
      // 分别代表的函数已：    商户等级         已拥有的 内标签   已拥有的 外标签
      let {gradeTagData} = this;
      let d = type === 'inner' ? gradeTagData.inner_tags : gradeTagData.outer_tags;
      // console.log(data, type, d);
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
      type === 'inner' ? gradeTagData.inner_tags = d : gradeTagData.outer_tags = d;
      that.$data.gradeTagData = gradeTagData;
      that.$forceUpdate(); //强制渲染
    },

    /**
     * 获取描述等级信息的数据列表
     * 1、请求api
     * 2、将描述等级信息的数据 赋值给 组件的 gradeList
     */
    async baseMerchantGradeList(data) {
      let that = this;
      let res = await Base.baseMerchantGradeList();
      if (res.code === 0) {
        that.$data.gradeList = res.data;
      } else {
        Message.warning(res.message);
      }
    },

    /**
     * 设置等级。接受一个参数，等级对象信息
     * 将用户选中的等级对象的 code，赋值给组件的 gradeTagData.grade_code
     */
    selectGrade(data) {
      let {gradeTagData} = this;
      gradeTagData.grade_code = data.code;
      this.$data.gradeTagData = gradeTagData;
    },

    /**
     * 修改商户的 标签和等级 信息
     * 1、获取已经修改好的 数据
     * 2、请求api。传递商户id 和 需要修改的数据值，进行修改。并等待响应结果
     * 3、如果响应正常。调用关闭 弹窗事件；并重新加载商户列表信息
     * 4、否则，提示异常信息。
     */
    async merchantGradeTagsEdit() {
      let that = this;
      let {gradeTagData, merchantDetail} = that;
      that.isSending = true;
      let res = await Merchant.merchantGradeTagsEdit({
        id: merchantDetail.id,
        ...gradeTagData
      });
      that.isSending = false;
      if (res.code === 0) {
        that.affirmTag();
      } else {
        Message.warning(res.message);
      }
    },

  }
}
</script>
<style lang="scss" scoped>

</style>
