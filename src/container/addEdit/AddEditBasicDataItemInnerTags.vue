<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'修改':'新增'}商品加价标签`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="加价率" prop="rise_min">
              <input-percent v-model="detail.rise_min" style="width: 160px;" :min="-999999"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="至" prop="rise_max">
              <input-percent v-model="detail.rise_max" style="width: 160px;" :min="-999999"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" :maxlength="20" placeholder="请输入20位以内的字符"></el-input>
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
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { InputPercent, InputPrice } from '@/common';

export default {
  name: "AddEditBasicDataItemInnerTags",
  mixins: [addEditMixin],
  components: {
    'input-percent': InputPercent
  },
  created() {
  },
  data(){
    let that = this;
    //区间判断
    let validRiseMax = function (rules, value, callback) {
      if (value <= that.detail.rise_min) {
        callback(new Error('不能小于或等于前区间'));
      } else {
        callback();
      }
    };

    return{
      initDetail: {
        title: '',
        rise_min: '',
        rise_max: '',
        remark: '',
        province_code: this.$province.code
      },
      rules: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        rise_min: [
          { required: true, message: '加价率不能为空', trigger: 'change' },
        ],
        rise_max: [
          { required: true, message: '加价率不能为空', trigger: 'change' },
          { validator: validRiseMax, trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataItemInnerTagsEdit' : 'basicdataItemInnerTagsAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableBasicDataItemInnerTags');
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
