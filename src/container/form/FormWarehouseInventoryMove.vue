<template>
  <form-layout :title="pageType === 'move' ? '移库' : '上架'" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="addData" ref="ruleForm" :rules="rules">
      <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="批次">{{detail.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库">{{detail.warehouse_title}}/{{detail.tray_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量">{{detail.num}}件</el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in addData.trays" :key="index">
        <el-col :span="12">
          <el-form-item :label="`${pageType === 'move' ? '移入仓库' : '上架托盘'}`" class="is-required">
            <cascader-warehouse-tray v-if="isShow" size="medium" :isShowTmpWarehouse="pageType === 'move' ? true : false" :storehouseId="storehouseId" v-model="item.tray_ids" @change="(v)=>changeTray(v, index)"/>
            <div v-if="item.tray_ids_error" class="el-form-item__error">{{item.tray_ids_error}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${pageType === 'move' ? '移库' : '上架'}数量`" class="is-required">
            <input-number size="medium" v-model="item.num" unit="件" :min="1" @change="inputNum(index)"/>
            <div v-if="item.num_error" class="el-form-item__error">{{item.num_error}}</div>
          </el-form-item>
          <a href="javascript:void(0);" @click="deleteTray(index)" v-if="addData.trays.length > 1" class="delete-a">删除</a>
        </el-col>
      </el-row>
      <el-form-item label="">
        <el-button size="mini" type="primary" @click.native="addTray">{{pageType === 'move' ? '增加仓库' : '增加托盘'}}</el-button>
      </el-form-item>
      <el-form-item label="备注" class="is-required" v-if="pageType === 'move'">
        <el-input v-model="addData.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
        <div v-if="addData.remark_error" class="el-form-item__error">{{addData.remark_error}}</div>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber } from '@/common';
import { CascaderWarehouseTray } from '@/component';

export default {
  name: "FormWarehouseInventoryMove",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
    'cascader-warehouse-tray': CascaderWarehouseTray
  },
  data(){
    let initDetail = {}
    let initAddData = {
      id: '', //tray_item_id
      remark: '',
      trays: [{tray_id: '', num: '', tray_ids: []}]
    }
    return{
      storehouseId: '', //页面的条件
      rules: {},
      initAddData: initAddData,
      addData: this.copyJson(initAddData),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      pageType: 'move', //move移库，putaway上架
    }
  },
  methods: {
    //显示form(重写)
    showForm(data){
      if(data){
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      let pc = this.getPageComponents('QueryWarehouseInventory');
      if(pc){
        this.$data.storehouseId = pc.query.storehouse_id;
      }
      this.$data.addData = this.copyJson(this.initAddData);
      this.$data.pageType = data.warehouse.ware_type === 'tmp' ? 'putaway' : 'move';
      this.$data.isShow = true;
    },
    //提交
    async submitData(){
      let { detail, addData, pageType } = this;
      let con = true;
      for(let i = 0; i < addData.trays.length; i++){
        if(!addData.trays[i].tray_id){
          addData.trays[i].tray_ids_error = '请选择托盘';
          con = false;
        }
        if(!addData.trays[i].num){
          addData.trays[i].num_error = '请输入数量';
          con = false;
        }
      }
      if(!addData.remark && pageType === 'move'){
        addData.remark_error = '请输入备注';
        con = false;
      }
      if(!con){
        this.$data.addData = this.copyJson(addData);
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supMoveAdd, {
        ...addData,
        id: detail.id
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: pageType === 'move' ? '已移库' : '已上架', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailWarehouseInventory');
        pc.wareTrayItemQeruy();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //添加托盘
    addTray(){
      this.addData.trays.push({tray_id: '', num: '', tray_ids: []});
      this.$data.addData = this.copyJson(this.addData);
    },
    //删除托盘
    deleteTray(index){
      this.addData.trays.remove(index);
      this.$data.addData = this.copyJson(this.addData);
    },
    //选择托盘
    changeTray(value, index){
      let { addData } = this;
      addData.trays[index].tray_id = value[2];
      addData.trays[index].tray_ids = value;
      addData.trays[index].tray_ids_error = '';
      this.$data.addData = this.copyJson(addData);
    },
    //输入数量
    inputNum(index){
      let { addData } = this;
      addData.trays[index].num_error = '';
      this.$data.addData = this.copyJson(addData);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .delete-a{
    font-size: 12px;
    position: absolute;
    right: -30px;
    top: 5px;
  }
</style>
