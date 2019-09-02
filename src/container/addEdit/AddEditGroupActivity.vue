<template>
  <el-dialog :title="`${detail.detail.id?'修改':'新增'}团购`" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
    <el-form class="custom-form" label-position="right" label-width="90px" :model="detail.detail" :rules="rules" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="团购名称" prop="title">
            <el-input size="small" v-model="detail.detail.title" @blur="editData" :disabled="judgeIsAllEdit() ? false : true" :maxLength="20" placeholder="请输入团购名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="团购时间" prop="picker_value">
             <el-date-picker
              size="small"
              style="width: 100%;"
              v-model="detail.detail.picker_value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="changePicker"
              @blur="editData"
              :disabled="judgeIsAllEdit() ? false : true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发货时间" prop="delivery_date">
            <el-date-picker
              size="small"
              :clearable="false"
              style="width: 100%;"
              placeholder="发货日期"
              v-model="detail.detail.delivery_date"
              type="date"
              value-format="yyyy-MM-dd"
              @blur="editData"
              :disabled="judgeIsAllEdit() ? false : true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3" v-if="!detail.detail.id">
          <el-form-item label="立即上架">
            <el-checkbox v-model="detail.detail.is_acitve" size="small"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--搜索-->
    <div class="search-div" v-if="!detail.detail.id">
      <search-group-item @onSelectItem="onSelectItem" style="width: 400px;margin-right: 10px;"/>
      <el-button type="primary" @click.native="addItem">增加商品</el-button>
    </div>
    <!--表格-->
    <el-table :data="detail.items" width="100%" :height="460" style="border-top: 1px solid #eee;">
      <el-table-column label="商品编号/名称">
        <div slot-scope="scope" class="add-dot">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
      </el-table-column>
      <el-table-column label="原价" width="100">
        <template slot-scope="scope">&yen;{{scope.row.price_origin}}</template>
      </el-table-column>
      <el-table-column label="团长价" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.header_price" size="small" class="my-input" :disabled="judgeIsAllEdit() ? false : true" @blur="groupActivityActItemEdit(scope.$index)"><template slot="append">元</template></el-input>
          <div class="error" v-if="scope.row.header_price_error">{{scope.row.header_price_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="团购价" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price_sale" size="small" class="my-input" :disabled="judgeIsAllEdit() ? false : true" @blur="groupActivityActItemEdit(scope.$index)"><template slot="append">元</template></el-input>
          <div class="error" v-if="scope.row.price_sale_error">{{scope.row.price_sale_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="单人最大购买数" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.max_num_pp" size="small" class="my-input" :disabled="judgeIsAllEdit() ? false : true" @blur="groupActivityActItemEdit(scope.$index)"><template slot="append">件</template></el-input>
          <div class="error" v-if="scope.row.max_num_pp_error">{{scope.row.max_num_pp_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.stock_num" size="small" class="my-input" @blur="groupActivityActItemEdit(scope.$index)"><template slot="append">件</template></el-input>
          <div class="error" v-if="scope.row.stock_num_error">{{scope.row.stock_num_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.rank" size="small" @blur="groupActivityActItemEdit(scope.$index)"/>
          <div class="error" v-if="scope.row.rank_error">{{scope.row.rank_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <a slot-scope="scope" href="javascript:void(0);"
          @click="deleteItem(scope.$index)"
          v-if="judgeIsAllEdit() && detail.items.length > 1 && (auth.isAdmin || auth.GroupActivityItemDelete)">移除</a>
        <span v-else>-</span>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer" v-if="!detail.detail.id">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification, DataHandle } from '@/util';
import { SearchGroupItem } from '@/common';

export default {
  name: "AddEditGroupActivity",
  mixins: [addEditMixin],
  components: {
    'search-group-item': SearchGroupItem
  },
  data(){
    //团购活动时间
    let validPickerValue = (rules, value, callback) => {
      if (value) {
        if (value.length <= 1) {
          return callback(new Error('请选择活动开始和结束时间'));
        } else if (new Date().getTime() > new Date(value[1]).getTime()) {
          return callback(new Error('活动结束时间不能小于当前时间'));
        } else if (value[0] === value[1]) {
          return callback(new Error('活动开始和结束时间不能相等'));
        } else {
          this.groupActivityActCheckDup(value, callback);
        }
      } else {
        return callback(new Error('请选择活动开始和结束时间'));
      }
    };
    //发货时间
    let validDeliveryDate = (rules, value, callback) => {
      if (value) {
        let { detail } = this;
        if (detail.detail.end_time && new Date(value).getTime() < new Date(DataHandle.returnDateFormat(detail.detail.end_time, 'yyyy-MM-dd')).getTime()) {
          return callback(new Error('发货日期不能小于团购的结束时间'));
        } else {
          callback();
        }
      } else {
        return callback(new Error('请选择发货日期'));
      }
    };
    let initDetail = {
      detail: {
        title: '',
        delivery_date: '',
        picker_value: null,
        start_time: '',
        end_time: '',
        is_acitve: false
      },
      items: []
    }
    return{
      selectItem: {},
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        title: [
          { required: true, message: '商品名称不能为空', trigger: 'change' },
        ],
        picker_value: [
          { validator: validPickerValue, trigger: 'blur' },
        ],
        delivery_date: [
          { validator: validDeliveryDate, trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        this.groupActivityDetail(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async groupActivityDetail(data){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupActivityDetail, { id: data.id, page: 1, page_size: 1000 });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //如果是复制
        if(data.type === 'copy'){
          delete rd.detail.id;
          rd.detail.delivery_date = '';
          rd.detail.start_time = '';
          rd.detail.end_time = '';
          rd.detail.picker_value = null;
        }else{
          rd.detail.picker_value = [rd.detail.start_time, rd.detail.end_time];
        }
        for(let i = 0; i < rd.items.length; i++){
          rd.items[i] = {
            id: rd.items[i].id,
            item_id: rd.items[i].item_id,
            item_code: rd.items[i].item_code,
            item_title: rd.items[i].item_title,
            price_origin: this.returnPrice(rd.items[i].price_origin),
            header_price: this.returnPrice(rd.items[i].header_price),
            price_sale: this.returnPrice(rd.items[i].price_sale),
            max_num_pp: (rd.items[i].max_num_pp).toString(),
            stock_num: (rd.items[i].stock_num).toString(),
            rank: (rd.items[i].rank).toString()
          }
        }
        this.$data.detail = this.copyJson(rd);
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //改变日期
    changePicker(value){
      if(value && value.length === 2){
        this.$data.detail.detail.start_time = value[0];
        this.$data.detail.detail.end_time = value[1];
      }else{
        this.$data.detail.detail.picker_value = null;
        this.$data.detail.detail.start_time = '';
        this.$data.detail.detail.end_time = '';
      }
    },
    //判断时间
    async groupActivityActCheckDup(value, callback) {
      let res = await Http.get(Config.api.groupActivityActCheckDup, {
        province_code: this.province.code,
        id: this.detail.detail.id || '',
        time_start: value[0],
        time_end: value[1]
      });
      if (res.code === 0) {
        if (!res.data) {
          callback();
        } else {
          callback(new Error('当前时间段已经存在团购活动'));
        }
      } else {
        callback(new Error('查询团购信息失败，请稍后再试...'));
      }
    },
    //判断是否可全部修改
    judgeIsAllEdit(){
      let { detail } = this;
      if(!detail.detail.id || detail.detail.progress_status === 'pre'){
        return true;
      }
      return false;
    },
    //修改提交数据
    editData(){
      if(this.detail.detail.id){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.addEditData();
          } else {
            return false;
          }
        });
      }
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      //校验
      if(detail.items.length === 0){
        this.$message({message: '商品不能为空', type: 'error'});
        return;
      }
      if(!this.judgeItems()){
        return;
      }

      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.detail.id ? 'groupActivityEdit' : 'groupActivityAdd'], {
        province_code: this.province.code,
        ...detail.detail,
        status: detail.detail.is_acitve ? 'activated' : 'deactivated', //是否立即上架
        items: detail.items_temp
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableGroupActivity');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //选择商品
    onSelectItem(data){
      this.$data.selectItem = data;
    },
    //增加商品
    addItem(){
      let { detail, selectItem } = this;
      if(!selectItem.id){
        this.$message({message: '请先选择商品', type: 'error'});
        return;
      }
      let cons = detail.items.filter(item => item.item_id === selectItem.id);
      if(cons.length > 0){
        this.$message({message: '此商品已加入', type: 'error'});
        return;
      }
      detail.items.push({
        item_id: selectItem.id,
        item_code: selectItem.code,
        item_title: selectItem.title,
        price_origin: this.returnPrice(selectItem.price_origin),
        header_price: this.returnPrice(selectItem.advice_header_price),
        price_sale: this.returnPrice(selectItem.advice_price_sale),
        max_num_pp: '99',
        stock_num: '',
        rank: '0'
      });
      this.$data.detail = detail;
    },
    //移除商品
    deleteItem(index){
      let { detail } = this;
      if(detail.detail.id){
        this.groupActivityActItemDelete(index);
      }else{
        detail.items.remove(index);
        this.$data.detail = this.copyJson(detail);
      }
    },
    //移除商品
    groupActivityActItemDelete(index){
      this.$messageBox.confirm(`您确认移除商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        (async ()=>{
          let { detail } = this;
          this.$loading({ isShow: true });
          let res = await Http.post(Config.api.groupActivityActItemDelete, { id: detail.items[index].id });
          this.$loading({ isShow: false });
          if(res.code === 0){
            detail.items.remove(index);
            this.$data.detail = this.copyJson(detail);
            this.$message({message: '已移除', type: 'success'});
          }else{
            this.$message({message: res.message, type: 'error'});
          }
        })();
      }).catch(() => {
        //console.log('取消');
      });
    },
    //校验商品
    judgeItems(index){
      let { detail } = this;
      let isPass = true;
      let fun = (i)=>{
        let item = detail.items[i];
        //判断团长价
        if(!item.header_price){
          item.header_price_error = '团长价不能空';
          isPass = false;
        }else if(!Verification.isPrice(item.header_price)){
          item.header_price_error = '金额不正确';
          isPass = false;
        }else if(Number(item.header_price) < Number(item.price_origin)){
          item.header_price_error = '不能小于原价';
          isPass = false;
        }else{
          item.header_price_error = '';
        }

        //判断团购价
        if(!item.price_sale){
          item.price_sale_error = '团长价不能空';
          isPass = false;
        }else if(!Verification.isPrice(item.price_sale)){
          item.price_sale_error = '金额不正确';
          isPass = false;
        }else if(Number(item.price_sale) < Number(item.header_price)){
          item.price_sale_error = '不能小于团购价';
          isPass = false;
        }else{
          item.price_sale_error = '';
        }

        //判断单人最大购买数
        if(!item.max_num_pp){
          item.max_num_pp_error = '购买数不能空';
          isPass = false;
        }else if(!Verification.isNumber(item.max_num_pp)){
          item.max_num_pp_error = '金额不正确';
          isPass = false;
        }else if(Number(item.max_num_pp) < 1){
          item.max_num_pp_error = '至少1件';
          isPass = false;
        }else{
          item.max_num_pp_error = '';
        }

        //判断单人最大购买数
        if(item.max_num_pp === ''){
          item.max_num_pp_error = '购买数不能空';
          isPass = false;
        }else if(!Verification.isNumber(item.max_num_pp)){
          item.max_num_pp_error = '数量不正确';
          isPass = false;
        }else if(Number(item.max_num_pp) < 1){
          item.max_num_pp_error = '至少1件';
          isPass = false;
        }else{
          item.max_num_pp_error = '';
        }

        //判断库存
        if(item.stock_num === ''){
          item.stock_num_error = '库存不能空';
          isPass = false;
        }else if(!Verification.isNumber(item.stock_num)){
          item.stock_num_error = '数量不正确';
          isPass = false;
        }else{
          item.stock_num_error = '';
        }

        //判断排序
        if(item.rank !== '' && !Verification.isNumber(item.rank)){
          item.rank_error = '数值不正确';
          isPass = false;
        }else{
          item.rank_error = '';
        }
      }

      if(typeof index === 'number'){
        fun(index);
      }else{
        detail.items_temp = [];
        for(let i = 0; i < detail.items.length; i++){
          fun(i);
          let item = detail.items[i];
          detail.items_temp.push({
            ...item,
            header_price: this.handlePrice(item.header_price),
            price_sale: this.handlePrice(item.price_sale),
            max_num_pp: Number(item.max_num_pp),
            stock_num: Number(item.stock_num),
            rank: item.rank === '' ? 0 : Number(item.rank)
          });
        }
      }
      this.$data.detail = this.copyJson(detail);
      return isPass;
    },
    //编辑商品
    async groupActivityActItemEdit(index){
      let { detail } = this;
      //如果是新增、复制
      if(!detail.detail.id) return;

      let item = detail.items[index];
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.groupActivityActItemEdit, {
        id: item.id,
        header_price: this.handlePrice(item.header_price),
        price_sale: this.handlePrice(item.price_sale),
        max_num_pp: Number(item.max_num_pp),
        stock_num: Number(item.stock_num),
        rank: item.rank === '' ? 0 : Number(item.rank)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .search-div{
    margin-bottom: 10px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  .error{
    color: #ff5252;
    font-size: 12px;
    position: absolute;
    left: 10px;
    right: 10px;
    text-align: center;
  }
</style>
<style>
  .my-input > .el-input__inner{
    text-align: center;
    padding: 0 5px;
  }
  .my-input > .el-input-group__append{
    padding: 0 10px !important;
  }
</style>
