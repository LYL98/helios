<template>
  <div>
    <add-edit-layout :title="returnPageTitles('托盘')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="110px" style="padding-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
        <h6 class="subtitle">库信息</h6>
        <el-form-item label="库名称">{{detail.warehouse.title}}</el-form-item>
        <el-form-item label="所属仓">{{detail.warehouse.storehouse.title}}</el-form-item>
        <h6 class="subtitle" style="margin-top: 20px; margin-bottom: 20px;">托盘信息</h6>
        <el-form-item label="托盘编号" prop="code">
          <el-input size="medium" v-model="detail.code" placeholder="请输入30位以内的字符" :maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left: 110px; margin-top: 40px; margin-bottom: 20px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'" v-if="auth.isAdmin || auth.WarehouseListTrayEdit">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEditTray",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    let initDetail = {
      code: '',
      warehouse_id: '',
      warehouse: {
        code: '',
        storehouse: {}
      }
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        code: [
            { required: true, message: '编号不能为空', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataWarehouseTrayEdit' : 'basicdataWarehouseTrayAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('Detail');
        if(this.pageType === 'add') pc.$data.query.page = 1;
        pc.getDetail();
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
