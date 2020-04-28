<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" label-width="100px" style="width: 600px;" :model="item" :rules="rules" ref="ruleForm">
      <el-form-item label="名称" prop="title">
        <el-input v-model="item.title" size="medium" placeholder="请输入20位以内的字符" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(c, i) in item.child_tags" :key="i"
        :label="`标签项-${i + 1}`"
        :prop="`child_tags[${i}].title`"
        :rules="[{ required: true, message: '名称不能为空', trigger: 'change' }]"
      >
        <el-row>
          <el-col :span="22">
            <el-input v-model="c.title" size="medium" placeholder="请输入20位以内的字符" :maxlength="20"></el-input>
          </el-col>
          <el-col :span="2" class="t-r">
            <a href="javascript:void(0);" @click="handleDeleteItem(i)" v-if="item.child_tags.length > 1" style="padding-top: 10px;">删除</a>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="">
        <el-button size="mini" @click="handleAddItem">增加标签项</el-button>
      </el-form-item>
    </el-form>
    <div class="dialog-footer t-r">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Row, Col, Button, Input } from "element-ui";
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-input': Input,
    'el-button': Button
  },
  props: {
    item: { type: Object, default: {} }, //confirmed 是否已发车
  },
  data(){
    return{
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    handleAddItem(){
      this.item.child_tags.push({
        title: ''
      });
    },
    handleDeleteItem(index){
      this.item.child_tags.remove(index);
      this.$forceUpdate(); //强制刷新
    },

    async handleSubmit() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.isSending = true;
          let { item } = this;
          let res = await Http.post(Config.api[item.id ? 'basicdataStoreTagEdit' : 'basicdataStoreTagAdd'], item);
          this.isSending = false;
          if (res.code === 0) {
            this.$refs['ruleForm'].resetFields();
            this.$emit('submitSuccess');
            this.$message({title: '提示', message: `${item.id ? '修改' : '新增'}成功`, type: 'success'});
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }

      });
    },

    handleCancel() {
      this.$emit('cancel');
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
