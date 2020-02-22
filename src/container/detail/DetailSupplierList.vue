<template>
  <detail-layout title="供应商详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <h6 class="subtitle">供应商信息</h6>
    <div style="padding: 0 30px 30px;">
      <el-table :data="[detail]" :row-class-name="highlightRowClassName">
        <el-table-column prop="title" label="供应商名称">
          <template slot-scope="scope">
            <span class="link-item" @click="handleShowAddEdit('AddEditSupplierList', scope.row, 'detail')">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">{{supplierType[scope.row.supplier_type]}}</template>
        </el-table-column>
        <el-table-column prop="linkman" label="联系人"/>
        <el-table-column prop="contact_phone" label="联系电话"/>
        <el-table-column label="结款类型">
          <template slot-scope="scope">{{supplierBillTerm[scope.row.bill_term]}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80" v-if="auth.isAdmin || auth.SupplierListEdit">
          <template slot-scope="scope">
            <a href="javascript:void(0);" @click="handleShowAddEdit('AddEditSupplierList', scope.row, 'edit')">修改</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row>
      <el-col :span="12">
        <h6 class="subtitle">用户账号</h6>
      </el-col>
      <el-col :span="12" v-if="auth.isAdmin || auth.SupplierListAccountAdd">
        <el-button class="f-r" size="mini" style="margin-right: 30px;" type="primary" @click.native="handleShowForm('FormSupplierAccount', detail)">新增用户</el-button>
      </el-col>
    </el-row>
    <div style="padding: 0 30px;">
      <el-table :data="detail.accounts" :row-class-name="highlightRowClassName">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="phone" label="账号手机号"/>
        <el-table-column label="冻结">
          <template slot-scope="scope">
            <el-switch
              @change="(v)=>supplierFreeze(v, scope.row)"
              :disabled="(auth.isAdmin || auth.SupplierListAccountFreeze) ? false : true"
              :value="scope.row.is_freeze"
              :active-value="true"
              :inactive-value="false"/>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="180"/>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailSupplierList",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        accounts: []
      }
      return {
        supplierType: Constant.SUPPLIER_TYPE(),
        supplierBillTerm: Constant.SUPPLIER_BILL_TERM(),
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: [],
        selectItemData: {},
        selectItemId: '',
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.getDetail(data.id);
      },
      //获取详情
      async getDetail(id){
        this.$loading({isShow: true});
        let res = await Http.get(Config.api.supplierDetail, { id });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.detail = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //冻结解冻
      async supplierFreeze(value, data){
        let str = value ? '冻结' : '解冻';
        this.$messageBox.confirm(`确认${str}该用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api[value ? 'supAccountFreeze' : 'supAccountUnFreeze'], {
            id: data.id
          });
          if(res.code === 0){
            this.$message({
              title: '提示',
              message: `已${str}`,
              type: 'success'
            });
            this.getDetail(this.detail.id);
          }else{
            this.$message({
              title: '提示',
              message: res.message,
              type: 'error'
            });
          }
        }).catch(() => {
          // console.log('取消');
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .link-item{
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      opacity: .7;
    }
  }
</style>
