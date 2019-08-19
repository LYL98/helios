<template>
  <div>
    <div style="margin-top: 20px; font-weight: bold; background-color: #fff; padding:0 20px;">编辑商品统一描述</div>
    <div style="background-color: #fff; padding: 16px 20px;">
      <div style="max-width: 960px;">
        <el-form :model="item" :rules="rules" ref="ruleForm">
          <el-form-item prop="content">
            <div :style="{ overflowY: 'auto', overflowX: 'auto', maxHeight: '500px'}">
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
  import { Form, FormItem, Button } from 'element-ui';
  import { QuillEditor } from '@/common';
  import { Constant, Config, Http } from '@/util';

  export default {
    name: "FormSystemSettingItemCommonDes",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'my-quill-editor': QuillEditor
    },
    data() {
      return {
        province: this.$province,
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
    created() {
      // 从后端拉取content，将获取到的content 赋值给 content。
      this.getItemCommon();
    },

    methods: {
      async getItemCommon() {
        let res = await Http.get(Config.api.basicdataGetCommonDescription, {
          province_code: this.province.code
        });
        if (res.code === 0) {
          this.item.content = res.data;
        } else {
          this.$message({message: res.message, type: 'error'});
        }
      },

      async setItemCommon(unified_description) {
        let res = await Http.post(Config.api.basicdataSetCommonDescription, {
          province_code: this.province.code,
          unified_description: unified_description
        });
        if (res.code === 0) {
          this.$message({message: '商品统一描述设置成功', type: 'success'});
        } else {
          this.$message({message: res.message, type: 'error'});
        }
      },

      handleSubmit() {
        if (!this.item.content) {
          this.$messageBox.confirm('确认清空商品统一描述?', '提示', {
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
