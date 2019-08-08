<template>
  <div class="zone-add-eidt">
    <el-dialog :title="`${detail.id?'修改':'新增'}线路`" :visible="isShow" width="720px" :before-close="handleCancel" :close-on-click-modal="false">
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
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectProvince, SelectCityMulti, SelectDistributorMulti } from '@/common';

export default {
  name: "AddEditOperateLine",
  mixins: [addEditMixin],
  components: {
    'my-select-province': SelectProvince,
    'my-select-city-multi': SelectCityMulti,
    'my-select-distributor-multi': SelectDistributorMulti
  },
  data(){
    let validCode = (rules, value, callback) => {
      if (value && !Verification.isNumber(value)) {
        return callback(new Error('请输入12位以内的数字'));
      }
      callback();
    };
    return{
      initDetail: {
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
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        this.$data.detail = JSON.parse(JSON.stringify({ ...data, id: true }));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //省份改变
    changeProvince(){
      this.$data.detail.city_codes = [];
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'operateLineEdit' : 'operateLineAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableOperateLine');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
