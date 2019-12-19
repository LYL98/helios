<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" label-position="right" :disabled="pageType === 'detail'" label-width="140px" style="width: 98%; max-width: 1400px; margin-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="选择入库单" prop="id">
          <select-in-stock size="medium" v-model="detail.id" style="width: 480px;" @change="selectInStock" :disabled="judgeOrs(pageType, ['edit', 'detail'])"/>
        </el-form-item>
        <el-form-item label="总件数">{{detail.num}}</el-form-item>
        <el-form-item label="未分配件数">{{detail.num - detail.num_distributed}}</el-form-item>
        <el-form-item label="调拨单">
          <div class="distribute">
            <div class="item" v-for="(item, index) in detail.distribute_items" :key="index">
              <div class="province">
                <select-province size="medium" v-model="item.province_code" style="width: 180px;" :disabled="judgeOrs(item.audit_status, ['success','fail']) ? true : false"/>
              </div>
              <div class="available-date">
                <el-date-picker size="medium" v-model="item.available_date" value-format="yyyy-MM-dd" placeholder="销售日期" style="width: 140px;" :disabled="judgeOrs(item.audit_status, ['success','fail']) ? true : false"/>
              </div>
              <div class="num"><input-number size="medium" v-model="item.num" style="width: 180px;" unit="件" :disabled="judgeOrs(item.audit_status, ['success','fail']) ? true : false"/></div>
              <div class="delete" v-if="pageType === 'add'">
                <i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteDistribute(index)"
                  v-if="detail.distribute_items.length > 1"></i>
              </div>
              <div class="edit" v-else-if="pageType === 'edit' && item.audit_status === 'init'">
                <el-button size="medium" @click.native="editDistribute(index)">确认修改</el-button>
              </div>
            </div>
            <a href="javascript: void(0);" @click="addDistribute" style="font-size: 12px;" v-if="pageType === 'add'">增加调拨单</a>
          </div>
        </el-form-item>
      </el-form>

      <div style="margin-left: 110px; margin-top: 80px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit" v-if="pageType === 'add'">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'" v-if="(auth.isAdmin || auth.SupplierGPurchaseDistributeEdit) && pageType === 'detail' && detail.audit_status === 'init'">修改</el-button>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config } from '@/util';
import { InputNumber, SelectProvince } from '@/common';
import { SelectInStock } from '@/component';

export default {
  name: "AddEditSupplierGPurchaseDistribute",
  mixins: [addEditMixin],
  components: {
    'select-in-stock': SelectInStock,
    'input-number': InputNumber,
    'select-province': SelectProvince
  },
  created() {
  },
  data(){
    let initDetail = {
      id: '',
      num: 0,
      num_distributed: 0,
      distribute_items: [{
        province_code: '',
        num: '',
        available_date: ''
      }]
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        id: [
          { required: true, message: '请选择入库单', trigger: 'change' }
        ]
      },
      pageTitles: {
        add: '新增统采调拨单',
        edit: '修改统采调拨单',
        detail: '统采调拨单详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.supplierInStockDetail(data.instock_id);
        this.$data.pageType = type;
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
        this.$data.pageType = 'add';
      }
    },
    //获取入库单详情
    async supplierInStockDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supplierInStockDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        if(rd.distribute_items.length === 0){
          rd.distribute_items = [{
            province_code: '',
            num: '',
            available_date: ''
          }];
        }
        this.$data.detail = rd;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //选择入库单
    selectInStock(){
      this.supplierInStockDetail(this.detail.id);
    },
    //增加调拨单
    addDistribute(){
      this.$data.detail.distribute_items.push({ supplier_id: '' });
    },
    //删除调拨单
    deleteDistribute(index){
      let { detail } = this;
      detail.distribute_items.remove(index);
      this.$data.detail = this.copyJson(detail);
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supplierGPurchaseDistributeAdd, {
        ...detail,
        instock_id: detail.id
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '调拨单新增成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableSupplierGPurchaseDistribute');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //修改调拨单
    async editDistribute(index){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supplierGPurchaseDistributeEdit, {
        ...detail.distribute_items[index]
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '调拨单修改成功', type: 'success'});
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
  .distribute{
    >.item{
      display: flex;
      align-items: center;
      >.province, >.available-date{
        margin-right: 10px;
      }
      >.num{
        padding-top: 3px;
      }
      >.edit{
        margin-left: 10px;
      }
    }
  }
</style>
