<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'修改':'新增'}商户等级`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="编号" prop="code">
          <el-input v-model="detail.code" :disabled="!!detail.id" placeholder="请输入12位以内的字母和数字组合" :maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" :maxlength="6" placeholder="请输入6位以内的字符"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3"  placeholder="0 - 999"></el-input>
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

export default {
  name: "AddEdit",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    let that = this;

    let validCode = function (rules, value, callback) {
      let asyncValid = () => {
        Http.get(Config.api.baseMerchantGradeList, {
          code: value
        }).then(res => {
          if (res.data && res.data.length > 0) {
            callback(new Error('编号重复，请重新输入'))
          } else {
            callback()
          }
        }).catch(e => {
          callback();
        })
      };

      let { detail } = that;
      if (detail.id) {
        //编辑模式
        if (value === detail.code) {
          //没有修改编号
          callback();
        } else {
          asyncValid()
        }
      } else {
        asyncValid()
      }
    };

    return{
      initDetail: {},
      rules: {
        code: [
            { required: true, message: '编号不能为空', trigger: 'blur' },
          { pattern: Verification.testStrs.isNumberOrAlpha, message: '请输入12位以内的字母和数字组合', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' },
        ],
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
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataGradeEdit' : 'basicdataGradeAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('Table');
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
</style>
