<template>
  <div class="zone-add-eidt">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}县域`" :visible="isShow" width="720px" :before-close="cancelAddEdit">
      <el-form label-position="right" label-width="120px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="编号" prop="code">
          <el-input v-model="detail.code" :disabled="detail.id" placeholder="请输入12位以内的字母和数字组合" :maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="所属省份" prop="province_code">
          <my-select-province :value="detail.province_code" @change="changeProvince"/>
        </el-form-item>
        <el-form-item label="所属片区" prop="zone_code">
          <my-select-zone :provinceCode="detail.province_code" :value="detail.zone_code" @change="changeZone"/>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>
        <el-form-item label="预估门店数" prop="store_num_pre">
          <el-input v-model="detail.store_num_pre" :maxlength="3"></el-input>
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
import { Form, FormItem, Button, Input, Dialog } from "element-ui";
import { Config, Constant, Verification } from '@/util';
import { SelectProvince, SelectZone } from '@/common';
import { Base } from '@/service';

export default {
  name: "CityAddEdit",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-dialog': Dialog,
    'my-select-province': SelectProvince,
    'my-select-zone': SelectZone
  },
  computed: mapGetters({
    isShow: 'basicDataCityIsShowAddEdit',
    basicDataCityDetail: 'basicDataCityDetail'
  }),
  data(){
    let that = this;

    let validCode = function (rules, value, callback) {
      let asyncValid = () => {
        Base.baseCityList({
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

      let detail = that.basicDataCityDetail;
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
        province_code: [
            { required: true, message: '请选择所属省份', trigger: 'change' }
        ],
        zone_code: [
            { required: true, message: '请选择所属片区', trigger: 'change' }
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ],
        store_num_pre: [
          { pattern: Verification.testStrs.isNumber, message: '预估门店数必须为正整数数字', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    //取消
    cancelAddEdit(){
      this.basicDataCityShowHideAddEdit({ isShow: false });
      // setTimeout(()=>{
      //   this.$refs['ruleForm'].resetFields();
      // },0);
    },

    // 切换省份时，所选省份，是否和当前省份一致！
    // 如果不一致，则清空city选择
    changeProvince(v) {
      if (v !== this.detail.province_code) { // 和当前的省份不同
        this.$set(this.detail, 'zone_code', '');
        this.$set(this.detail, 'province_code', v);
      }
    },

    changeZone(v) {
      if (!v) {
        return;
      }
      if (v !== this.detail.zone_code) {
        this.$set(this.detail, 'zone_code', v);
      }

    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;

          detail.rank = Number(detail.rank);
          detail.store_num_pre = Number(detail.store_num_pre);

          that.basicDataCityAddEdit({
            data: detail,
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.cancelAddEdit();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['basicDataCityShowHideAddEdit', 'basicDataCityAddEdit'])
  },
  watch:{
    basicDataCityDetail: {
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
