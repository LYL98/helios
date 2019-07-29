<template>
  <div class="zone-add-eidt">
    <el-dialog :title="`${detail.id?'编辑':'新增'}线路`" :visible="isShow" width="720px" :before-close="cancelAddEdit" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="编号" prop="code">
          <el-input v-model="detail.code" :maxlength="12" placeholder="请输入编号" :disabled="detail.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" :maxlength="10" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="所属省份" prop="province_code">
          <my-select-province v-model="detail.province_code" @change="changeProvince" />
        </el-form-item>
        <el-form-item label="包含县域" prop="city_codes">
          <my-select-city-multi filterable :provinceCode="detail.province_code" v-model="detail.city_codes" />
        </el-form-item>
        <el-form-item label="配送员">
          <my-select-distributor-multi :provinceCode="detail.province_code" v-model="detail.distributor_ids" />
        </el-form-item>
        <!--<el-form-item label="排序" prop="rank">-->
          <!--<el-input v-model="detail.rank"></el-input>-->
        <!--</el-form-item>-->
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
import { Form, FormItem, Button, Input, Dialog } from 'element-ui';
import { Config, Constant, Verification } from '@/util';
import { SelectProvince, SelectCityMulti, SelectDistributorMulti } from '@/common';

export default {
  name: "LineAddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'my-select-province': SelectProvince,
    'my-select-city-multi': SelectCityMulti,
    'my-select-distributor-multi': SelectDistributorMulti
  },
  computed: mapGetters({
    isShow: 'operateLineIsShowAddEdit',
    operateLineDetail: 'operateLineDetail'
  }),
  data(){
    let validCode = (rules, value, callback) => {
      if (value && !Verification.isNumber(value)) {
        return callback(new Error('请输入12位以内的数字'));
      }
      callback();
    };
    return{
      detail: {
        code: '',
        title: '',
        city_codes: [],
        distributor_ids: []
      },
      rules: {
        code: [
            { required: true, message: '编号不能为空', trigger: 'change' },
            { validator: validCode, trigger: 'blur' }
        ],
        title: [
            { required: true, message: '名称不能为空', trigger: 'change' },
            { max: 10, message: '请输入10个以内的字符', trigger: 'blur' }
        ],
        province_code: [
            { required: true, message: '请选择所属省份', trigger: 'change' }
        ],
        city_codes: [
            { required: true, type: 'array', message: '至少选择一个县域', trigger: 'click' }
        ],
        // distributor_ids: [
        //     { required: true, type: 'array', message: '请选择配送员', trigger: 'click' }
        // ]
      }
    }
  },
  methods: {
    //省份改变
    changeProvince(){
      this.$data.detail.city_codes = [];
    },
    //取消
    cancelAddEdit(){
      this.operateLineShowHideAddEdit({ isShow: false });
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;
          that.operateLineAddEdit({
            data: detail,
            callback: (res)=>{
              let c = that.$attrs.callback;
              typeof c === 'function' && c(res);//回调
              that.cancelAddEdit();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['operateLineShowHideAddEdit', 'operateLineAddEdit'])
  },
  watch:{
    operateLineDetail: {
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
