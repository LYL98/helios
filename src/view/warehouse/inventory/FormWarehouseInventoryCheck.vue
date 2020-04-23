<template>
  <form-layout title="盘点" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog" width="840px">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次">{{detail.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库">{{detail.warehouse_title}}/{{detail.tray_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品过期时间">{{detail.due_date || '-'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存过期时间">{{detail.stock_due_date || '-'}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="盘点后库存" prop="num_after">
            <input-number size="medium" v-model="detail.num_after" unit="件"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="盘点类型">
            <el-input v-if="typeof detail.num_after !== 'number' || detail.num === detail.num_after" disabled value="正常" size="medium"/>
            <el-input v-else-if="detail.num > detail.num_after" disabled value="盘亏" size="medium"/>
            <el-input v-else-if="detail.num < detail.num_after" disabled value="盘盈" size="medium"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点数量">
            <input-number size="medium" disabled v-if="typeof detail.num_after === 'number'" :value="detail.num_after - detail.num" unit="件"/>
            <el-input v-else disabled value="-" size="medium"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="" v-if="!isShowMove">
        <a href="javascript:void(0);" @click="showhideMove" style="font-size: 12px;">移库更正库位</a>
      </el-form-item>

      <template v-else>
        <el-row>
          <el-col :span="12">
            <h6 class="subtitle">移库</h6>
          </el-col>
          <el-col :span="12">
            <a href="javascript:void(0);" @click="showhideMove" style="font-size: 12px;" class="f-r">删除</a>
          </el-col>
        </el-row>
        <el-row v-for="(item, index) in moveTrays" :key="index">
          <el-col :span="12">
            <el-form-item label="移入仓库" class="is-required">
              <cascader-warehouse-tray v-if="isShow" size="medium" isShowTmpWarehouse :storehouseId="storehouseId" v-model="item.tray_ids" @change="(v)=>changeTray(v, index)"/>
              <div v-if="item.tray_ids_error" class="el-form-item__error">{{item.tray_ids_error}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="移库数量" class="is-required">
              <input-number size="medium" v-model="item.num" unit="件" :min="1" @change="inputNum(index)"/>
              <div v-if="item.num_error" class="el-form-item__error">{{item.num_error}}</div>
            </el-form-item>
            <a href="javascript:void(0);" @click="deleteTray(index)" v-if="moveTrays.length > 1" class="delete-a">删除</a>
          </el-col>
        </el-row>
        <el-form-item label="">
          <el-button size="mini" type="primary" @click.native="addTray">增加仓库</el-button>
        </el-form-item>
      </template>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="detail.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left: 140px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { InputNumber } from '@/common';
import { CascaderWarehouseTray } from '@/component';

export default {
  name: "FormWarehouseInventoryCheck",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
    'cascader-warehouse-tray': CascaderWarehouseTray
  },
  data(){
    let initDetail = {}
    return{
      storehouseId: '', //页面的条件
      rules: {
        num_after: { required: true, message: '请输入盘点后数量', trigger: 'change' },
        remark: { required: true, message: '请输入备注', trigger: 'change' }
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      isShowMove: false,
      moveTrays: []
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
      this.$data.isShowMove = false;
      this.$data.moveTrays = [];
      this.$data.isShow = true;
    },
    //提交
    async submitData(){
      let { detail, moveTrays } = this;
      let con = true;
      for(let i = 0; i < moveTrays.length; i++){
        if(!moveTrays[i].tray_id){
          moveTrays[i].tray_ids_error = '请选择托盘';
          con = false;
        }
        if(!moveTrays[i].num){
          moveTrays[i].num_error = '请输入数量';
          con = false;
        }
      }
      if(!con){
        this.$data.moveTrays = this.copyJson(moveTrays);
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supCheckAdd, {
        id: detail.id,
        num_after: detail.num_after,
        remark: detail.remark,
        trays: moveTrays
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已盘点', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailWarehouseInventory');
        pc.wareTrayItemQuery();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //显示移库信息
    showhideMove(){
      if(this.isShowMove){
        this.$data.moveTrays = [];
      }else{
        this.addTray();
      }
      this.$data.isShowMove = !this.isShowMove;
    },
    //添加托盘
    addTray(){
      this.moveTrays.push({tray_id: '', num: '', tray_ids: []});
      this.$data.moveTrays = this.copyJson(this.moveTrays);
    },
    //删除托盘
    deleteTray(index){
      this.moveTrays.remove(index);
      this.$data.moveTrays = this.copyJson(this.moveTrays);
    },
    //选择托盘
    changeTray(value, index){
      this.moveTrays[index].tray_id = value[2];
      this.moveTrays[index].tray_ids = value;
      this.moveTrays[index].tray_ids_error = '';
      this.$data.moveTrays = this.copyJson(this.moveTrays);
    },
    //输入数量
    inputNum(index){
      this.moveTrays[index].num_error = '';
      this.$data.moveTrays = this.copyJson(this.moveTrays);
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
