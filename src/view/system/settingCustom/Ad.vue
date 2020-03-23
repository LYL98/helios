<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" :disabled="!isEdit" label-width="110px" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">广告设置</h6>
      <el-form-item label="广告语" prop="ad">
        <el-input size="medium" maxLength="10" v-model="detail.ad" placeholder="请输入10位以内的字符"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <template v-if="isEdit">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </template>
      <template v-else>
        <el-button size="medium" @click.native="isEdit = true">修 改</el-button>
      </template>
    </div>
  </div>
</template>

<script>
  import addEditMixin from '@/share/mixin/add.edit.mixin';
  import { Http, Config } from '@/util';

  export default {
    name: "Ad",
    mixins: [addEditMixin],
    data() {
      return{
        isEdit: false,
        detail: {
          ad: ''
        },
        rules: {
          ad: [
            { required: true, message: '广告语不能为空', trigger: 'change' },
          ]
        }
      }
    },
    created() {
      this.basicdataAdGet();
    },
    methods: {
      //取消
      handleCancel(){
        this.basicdataAdGet();
        this.$data.isEdit = false;
      },
      //获取广告语
      async basicdataAdGet() {
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.basicdataAd, {
          province_code: this.$province.code
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$data.detail.ad = res.data;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //设置广告语
      async addEditData() {
        this.$loading({isShow: true});
        let res = await Http.post(Config.api.basicdataAd, {
          province_code: this.$province.code,
          ad: this.detail.ad,
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$message({message: '广告语设置成功', type: 'success'});
          this.handleCancel();
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
