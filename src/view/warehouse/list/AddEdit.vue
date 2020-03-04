<template>
  <div>
    <add-edit-layout :title="returnPageTitles('库')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="110px" style="padding-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="库名称" prop="title">
          <el-input size="medium" v-model="detail.title" placeholder="请输入10位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="所属仓" prop="storehouse_id">
          <select-storehouse size="medium" v-model="detail.storehouse_id" :disabled="pageType === 'add' ? false : true" />
        </el-form-item>
      </el-form>
      <div style="margin-left: 110px; margin-top: 40px; margin-bottom: 20px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'" v-if="auth.isAdmin || auth.WarehouseListEdit">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from '@/container/addEdit/add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectStorehouse } from '@/component';

export default {
  name: "AddEdit",
  mixins: [addEditMixin],
  components: {
    'select-storehouse': SelectStorehouse
  },
  data(){

    return{
      initDetail: {
        title: '',
        storehouse_id: ''
      },
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        storehouse_id: [
            { required: true, message: '请选择仓', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataWarehouseEdit' : 'basicdataWarehouseAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('Table');
        pc.getData(pc.query);
        //如果详情显示
        let pc2 = this.getPageComponents('Detail');
        if(pc2.isShow) pc2.getDetail();
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
