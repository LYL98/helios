<template>
  <div>
    <h2 style="margin-bottom: 20px; font-weight: 300; background-color: #fff; padding: 16px 20px;">编辑商品统一描述</h2>
    <div style="background-color: #fff; padding: 16px 20px;">
      <div style="max-width: 960px;">
        <el-form :model="item" :rules="rules" ref="ruleForm">
          <el-form-item prop="content">
            <div :style="{ overflowY: 'auto', overflowX: 'auto', height: windowHeight - offsetHeight + 'px'}">
              <my-quill-editor v-model="item.content"></my-quill-editor>
            </div>
          </el-form-item>
          <el-form-item style="display: flex; justify-content: flex-end; padding: 10px;">
            <el-button type="primary" @click="handleSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { Form, FormItem, Button, Message, MessageBox } from 'element-ui';
  import { QuillEditor } from '@/common';
  import { BasicData } from '@/service';
  import { mapGetters } from 'vuex';
  import { Constant } from '@/util';

  export default {
    name: "ItemCommonDescription",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'my-quill-editor': QuillEditor
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + 82 + 83 + 40 + 16,
        item: {
          content: ''
        },
        rules: {
          content: [
            { max: 500, message: '统一描述最大字符数不能超过500个字符', trigger: 'change' }
          ]
        }
      }
    },
    computed: mapGetters({
      windowHeight: 'windowHeight'
    }),
    created() {
      // 从后端拉取content，将获取到的content 赋值给 content。
      this.getItemCommon();
    },

    methods: {
      async getItemCommon() {
        let res = await BasicData.basicdataGetCommonDescription();
        if (res.code === 0) {
          this.item.content = res.data;
        } else {
          Message.warning(res.message);
        }
      },

      async setItemCommon(unified_description) {
        let res = await BasicData.basicdataSetCommonDescription({unified_description});
        if (res.code === 0) {
          Message.success('商品统一描述设置成功');
        } else {
          Message.warning(res.message);
        }
      },

      handleSubmit() {
        // this.$refs['ruleForm'].validate(valid => {
        //   if (valid) {
        //   }
        // })

        if (!this.item.content) {
          MessageBox.confirm('确认清空商品统一描述?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.setItemCommon('');
          }).catch(() => {
            // console.log('取消');
          });
        } else {
          this.setItemCommon(this.item.content);
        }
      }

    }
  }
</script>

<style scoped>

</style>
