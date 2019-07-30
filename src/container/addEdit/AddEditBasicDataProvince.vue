<template>
  <div class="province-add-eidt">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}省`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="编号" prop="code">
          <el-input v-model="detail.code" :disabled="detail.id" placeholder="请输入12位以内的字母和数字组合" :maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="submitAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEditProvince",
  mixins: [addEditMixin],
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog
  },
  computed: mapGetters({
    isShow: 'basicDataProvinceIsShowAddEdit',
    basicDataProvinceDetail: 'basicDataProvinceDetail'
  }),
  data(){

    let that = this;

    let validCode = function (rules, value, callback) {
      let asyncValid = () => {
        Http.get(Config.api.baseProvinceList, {
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

      let detail = that.basicDataProvinceDetail;
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
      detail: {},
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
    //取消
    handleCancel(){
      this.basicDataProvinceShowHideAddEdit({ isShow: false });
      // setTimeout(()=>{
      //   this.$refs['ruleForm'].resetFields();
      // },0);
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          that.basicDataProvinceAddEdit({
            data: detail,
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.handleCancel();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['basicDataProvinceShowHideAddEdit', 'basicDataProvinceAddEdit'])
  },
  watch:{
    basicDataProvinceDetail: {
      deep: true,
      handler: function (a, b) {
        this.detail = JSON.parse( JSON.stringify( a ) );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
