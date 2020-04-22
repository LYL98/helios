<template>
  <div>
    <add-edit-layout :title="returnPageTitles('仓')" :isShow="isShow" direction="ttb" :before-close="handleCancel"
                     type="dialog">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'"
               label-width="110px" style="padding-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="仓名称" prop="title">
          <el-input size="medium" v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="province_code">
          <!-- 此处添加v-if 解决dialog 不关闭情况下，无法重新打开组件 sync province 的问题 -->
          <my-select-province v-if="isShow" size="medium" v-model="detail.province_code" nationwide
                              :disabled="pageType === 'add' ? false : true" @change="changeProvince" @sync="syncProvince"/>
        </el-form-item>
        <el-form-item label="地理位置" prop="geo">
          <my-location-picker :disabled="pageType === 'detail'" size="small" level="province" v-model="detail.geo" @change="changeGeo"></my-location-picker>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input size="medium" v-model="detail.address" placeholder="请输入200位以内的字符" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left: 110px; margin-top: 40px; margin-bottom: 20px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'"
                     v-if="auth.isAdmin || auth.StorehouseEdit">修改
          </el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
  import addEditMixin from '@/share/mixin/add.edit.mixin';
  import {Http, Config, Constant, Verification} from '@/util';
  import {SelectProvince, LocationPicker} from '@/common';

  export default {
    name: "AddEdit",
    mixins: [addEditMixin],
    components: {
      'my-select-province': SelectProvince,
      'my-location-picker': LocationPicker,
    },
    data() {
      let validLocation = function (rules, value, callback) {
        if (!value.lng && !value.lat) {
          return callback(new Error('地理位置不能为空'));
        }
        callback();
      };
      return {
        initDetail: {
          geo: { lng: '', lat: '', province_title: '', city_title: '', poi: '' },
        },
        detail: {
        },
        rules: {
          title: [
            {required: true, message: '名称不能为空', trigger: 'change'}
          ],
          province_code: [
            {required: true, message: '请选择所属区域', trigger: 'change'}
          ],
          geo: [
            { required: true, validator: validLocation, trigger: 'change' },
          ],
          address: [
            {required: true, message: '请输入详细地址', trigger: 'change'}
          ],
        },
      }
    },
    methods: {
      syncProvince(province) {
        this.$set(this.$data.detail.geo, 'province_title', province.title);
      },

      changeProvince() {
        this.$data.detail.geo.lng = '';
        this.$data.detail.geo.lat = '';
        this.$data.detail.geo.poi = '';
        this.$data.detail.geo.city_title = '';
      },

      changeGeo() {
        this.$refs['ruleForm'].validateField('geo');
      },
      //显示新增修改(供外部也调用)
      showAddEdit(data, type){
        if(data){
          let d = this.copyJson(data);
          if (Object.keys(d.geo).length === 0) {
            d.geo = {lng: '', lat: '', province_title: '', city_title: '', poi: ''};
          }
          this.$data.detail = d;
        }else{
          this.$data.detail = this.copyJson(this.initDetail);
        }
        if(type) this.$data.pageType = type;
        this.$data.isShow = true;
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      },
      //提交数据
      async addEditData() {
        let {detail} = this;
        this.$loading({isShow: true});
        let res = await Http.post(Config.api[detail.id ? 'basicdataStorehouseEdit' : 'basicdataStorehouseAdd'], detail);
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
          this.handleCancel(); //隐藏
          //刷新数据(列表)
          let pc = this.getPageComponents('Table');
          pc.getData(pc.query);
        } else {
          this.$message({message: res.message, type: 'error'});
        }
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
