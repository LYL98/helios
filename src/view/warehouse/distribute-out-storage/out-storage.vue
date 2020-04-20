<template>
  <form-layout title="出库" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总库存">{{trayItems.stock_num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应出库">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已出库">{{detail.num_out ? detail.num_out + '件' : '-'}}</el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, index) in addData.tray_items" :key="index">
        <el-col :span="9">
          <el-form-item label="仓库" prop="tray_index">
            <el-select size="medium" v-model="item.tray_index" @change="(v) => changeTray(v, index)" style="width: 100%;">
              <el-option
                v-for="(item, i) in trayItems.items"
                :key="i"
                :label="`${item.warehouse_title} / ${item.tray_code}`"
                :value="i"
                :disabled="returnTray(i)"
              />
            </el-select>
            <span v-if="item.tray_index_error" class="el-form-item__error">{{item.tray_index_error}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="库存数量">
            <input-number size="medium" :value="item.tray_index === '' ? '' : trayItems.items[item.tray_index].num" unit="件" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="出库数量" prop="num" >
            <input-number size="medium" v-model="item.num" unit="件" :min="1" @change="inputNum(index)"/>
            <span v-if="item.num_error" class="el-form-item__error">{{item.num_error}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <a href="javascript:void(0);" @click="deleteTray(index)" v-if="addData.tray_items.length > 1" class="delete-a">删除</a>
        </el-col>
      </el-row>
      <el-form-item label="">
        <el-button size="mini" type="primary" @click.native="addTray">增加仓库</el-button>
        <span v-if="addData.sum_num_error" class="el-form-item__error">{{addData.sum_num_error}}</span>
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
import { Http, Config } from '@/util';
import { InputNumber } from '@/common';

export default {
  name: "OutStorage",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber
  },
  data(){
    let initDetail = {};
    //数量校验
    const validNum = (rules, value, callback)=>{
      let { detail } = this;
      if(Number(value) > detail.num) {
        return callback(new Error('出库数量不能大于库存'));
      }
      if(Number(value) > detail.num - detail.num_out) {
        return callback(new Error('出库数量不能大于应出库数量'));
      }
      callback();
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      trayItems: {
        items: [],
        num: 0,
        sock_num: 0
      },
      addData: {
        distribute_plan_detail_id: '',
        tray_items: []
      }
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
      this.$data.addData = {
        distribute_plan_detail_id: '',
        tray_items: []
      };
      this.$data.trayItems = {
        items: [],
        num: 0,
        sock_num: 0
      };
      this.wareTrayItemQeruy();
    },
    //获取库存列表
    async wareTrayItemQeruy(){
      let { addData, detail } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.wareTrayItemQeruy, {
        item_code: detail.item_code,
        storehouse_id: detail.storehouse.id
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        addData.distribute_plan_detail_id = detail.id;
        let sumNum = 0;
        for(let i = 0; i < rd.items.length; i++){
          if(rd.items[i].num + sumNum < detail.num - detail.num_out){
            addData.tray_items.push({tray_item_id: rd.items[i].id, tray_index: i, num: rd.items[i].num});
            sumNum = sumNum + rd.items[i].num;
          }else{
            addData.tray_items.push({tray_item_id: rd.items[i].id, tray_index: i, num: detail.num - sumNum - detail.num_out});
            break;
          }
        }
        if(addData.tray_items.length === 0){
          addData.tray_items.push({tray_item_id: '', tray_index: '', num: ''});
        }
        this.$data.trayItems = rd;
        this.$data.addData = addData;
        this.$data.isShow = true;
        if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //返回托盘是禁用
    returnTray(index){
      let { addData } = this;
      let con = addData.tray_items.filter(item => item.tray_index === index);
      if(con.length > 0) return true;
      return false;
    },
    //添加托盘
    addTray(){
      let { addData } = this;
      addData.tray_items.push({tray_item_id: '', tray_index: '', num: ''});
      addData.sum_num_error = '';
      addData.$data = this.copyJson(addData);
    },
    //删除托盘
    deleteTray(index){
      let { addData } = this;
      addData.tray_items.remove(index);
      addData.sum_num_error = '';
      this.$data.addData = this.copyJson(addData);
    },
    //选择托盘
    changeTray(i, index){
      let { addData, data, trayItems } = this;
      addData.tray_items[index].tray_item_id = trayItems.items[i].id;
      addData.tray_items[index].tray_index = i;
      addData.tray_items[index].tray_index_error = '';
      addData.sum_num_error = '';
      this.$data.addData = this.copyJson(addData);
    },
    //输入数量
    inputNum(index){
      let { addData } = this;
      addData.tray_items[index].num_error = '';
      addData.sum_num_error = '';
      this.$data.addData = this.copyJson(addData);
    },
    //提交
    async submitData(){
      let { detail, addData, trayItems } = this;
      //校验
      let con = false, sumNum = 0;
      for(let i = 0; i < addData.tray_items.length; i++){
        let d = addData.tray_items[i];
        if(d.tray_index === ''){
          d.tray_index_error = '请选择仓库';
          con = true;
        }
        if(!d.num){
          d.num_error = '请输入出库数量且大于0';
          con = true;
        }else if(d.tray_index !== '' && d.num > trayItems.items[d.tray_index].num){
          d.num_error = '出库数量不能大于库存数量';
          con = true;
        }
        sumNum = sumNum + d.num;
      }
      if(sumNum > detail.num - detail.num_out){
        addData.sum_num_error = '出库总数不能大于待出库数量';
        con = true;
      }
      if(con){
        this.$data.addData = this.copyJson(addData);
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supOutAddWithDistPlan, addData);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.handleCancel();
        this.$message({message: '已出库', type: 'success'});
        //刷新仓库出库计划列表
        let pc = this.getPageComponents('Table');
        if(pc) pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .delete-a{
    font-size: 12px;
    margin: 5px 0 0 10px;
    display: block;
  }
</style>
