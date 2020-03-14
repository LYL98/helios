<template>
  <div class="zone-add-eidt">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'修改':'新增'}县域`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="120px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="所属省份" prop="province_code">
          <my-select-province :value="detail.province_code" @change="changeProvince" :disabled="detail.id ? true: false"/>
        </el-form-item>
        <el-form-item label="所属片区" prop="zone_id">
          <my-select-zone :provinceCode="detail.province_code" :value="detail.zone_id" @change="changeZone" :disabled="detail.id ? true: false"/>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>
        <el-form-item label="预估门店数" prop="store_num_pre">
          <el-input v-model="detail.store_num_pre" :maxlength="3"></el-input>
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
import addEditMixin from '@/container/addEdit/add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { SelectProvince, SelectZone } from '@/common';

export default {
  name: "AddEditCity",
  mixins: [addEditMixin],
  components: {
    'my-select-province': SelectProvince,
    'my-select-zone': SelectZone
  },
  data(){
    return{
      initDetail: {},
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        province_code: [
            { required: true, message: '请选择所属省份', trigger: 'change' }
        ],
        zone_id: [
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

    // 切换省份时，所选省份，是否和当前省份一致！
    // 如果不一致，则清空city选择
    changeProvince(v) {
      if (v !== this.detail.province_code) { // 和当前的省份不同
        this.$set(this.detail, 'zone_id', '');
        this.$set(this.detail, 'province_code', v);
      }
    },

    changeZone(v) {
      if (!v) {
        return;
      }
      if (v !== this.detail.zone_id) {
        this.$set(this.detail, 'zone_id', v);
      }

    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      detail.rank = Number(detail.rank);
      detail.store_num_pre = Number(detail.store_num_pre);
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataCityEdit' : 'basicdataCityAdd'], detail);
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
