<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="分配方式">
          <button-group v-model="detail.opt_type" :options="allotOptTypes" buttonWidth="160" :disabled="allocateNeed.sorted"/>
        </el-form-item>
        <el-form-item label="">
          <el-row>
            <el-col>应出商品总数：{{allocateNeed.num}}件</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">该批次商品：{{detail.num}}件</el-col>
            <el-col :span="12" v-if="allocateNeed.num - detail.num > 0" style="color: #ff5252;">缺货：{{allocateNeed.num - detail.num}}件</el-col>
            <el-col :span="12" v-else-if="allocateNeed.num - detail.num < 0" style="color: #ff5252;">多货：{{detail.num - allocateNeed.num}}件</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" v-if="allocateNeed.num - detail.num > 0">
          <div>提示：</div>
          <div>1、选择分配方式后，后续到货的该商品都将按照该方式自动分配；</div>
          <div>2、若有缺货将根据分配方式系统自动取消订单。</div>
          <div v-if="allocateNeed.sorted">3、该商品已经选{{allocateNeed.cur_opt_type==='by_line'?'按线路分配':'按下单时间分配'}}分配，所有批次商品都将按照该方式进行分配；</div>
        </el-form-item>
        <el-form-item label="" v-else-if="allocateNeed.num - detail.num < 0">
          <div>提示：</div>
          <div>1、多货的商品库存将在分配完成后，自动进入仓库的临时仓；</div>
          <div>2、系统会自动将该批次分配数量调整为应出商品总数。</div>
          <div v-if="allocateNeed.sorted">3、该商品已经选{{allocateNeed.cur_opt_type==='by_line'?'按线路分配':'按下单时间分配'}}分配，所有批次商品都将按照该方式进行分配；</div>
        </el-form-item>
      </el-form>
      <div class="bottom-btn">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant } from '@/util';
import { ButtonGroup } from '@/common';

export default {
  name: "AddEditOperateSort",
  mixins: [addEditMixin],
  components: {
    'button-group': ButtonGroup
  },
  created() {
  },
  data(){
    let initDetail = {
      out_stock_id: '',
      opt_type: 'by_line'
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      allotOptTypes: Constant.ALLOT_OPT_TYPES('value_key'),
      allocateNeed: {
        num: 0,
        cur_opt_type: '',
        sorted: false
      },
      rules: {},
      pageTitles: {
        add: '分配',
        edit: '修改分配方式'
      }
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.$data.pageType = type;
      this.supAllocateNeedItem(data);
    },
    //返回某个商品还有多少件需要分配
    async supAllocateNeedItem(data){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.supAllocateNeedItem, {sub_item_id: data.item_id});
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.allocateNeed = rd;
        this.$data.detail = this.copyJson({
          num: data.num,
          out_stock_id: this.pageType === 'add' ? data.id : data.out_stock.id,
          opt_type: rd.cur_opt_type || 'by_line',
        });
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交数据
    async addEditData(e){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supAllocateAdd, detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '分配成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableOperateSort');
        pc.getData(pc.query);
        //刷新详情数据
        let detailPc = this.getPageComponents('DetailOperateSort');
        if(detailPc.isShow){
          
        }
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>
