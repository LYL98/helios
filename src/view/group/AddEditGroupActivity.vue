<template>
  <el-dialog :title="`${detail.detail.id?'修改':'新增'}团购`" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
    <el-form class="custom-form" label-position="right" label-width="90px" :model="detail.detail" :rules="rules" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="团购名称" prop="title">
            <el-input size="small" v-model="detail.detail.title" :disabled="isDisabledEdit" :maxLength="20" placeholder="请输入团购名称"/>
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
              :disabled="isDisabledEdit"
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
              :disabled="isDisabledEdit"
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
    <div class="search-div">
      <search-group-item @onSelectItem="onSelectItem" v-model="selectItemId" :provinceCode="$province.code" :disabled="isDisabledAddItem" style="width: 400px;margin-right: 10px;"/>
      <el-button type="primary" @click.native="addItem" :disabled="isDisabledAddItem">增加商品</el-button>
    </div>
    <!--表格-->
    <el-table :data="detail.items" width="100%" :height="460" style="border-top: 1px solid #eee;">
      <el-table-column label="商品编号/名称">
        <div slot-scope="scope" class="add-dot">{{scope.row.item_code}}/{{scope.row.item_title}}</div>
      </el-table-column>
      <el-table-column label="市场价" width="100">
        <template slot-scope="scope">&yen;{{scope.row.price_origin}}</template>
      </el-table-column>
      <el-table-column label="团长价" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.header_price" size="small" class="my-input" :disabled="isDisabledEdit && !scope.row.is_new_add ? true : false" @input.native="inputChange(scope.$index)"><template slot="append">元</template></el-input>
          <div class="error" v-if="scope.row.header_price_error">{{scope.row.header_price_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="团购价" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price_sale" size="small" class="my-input" :disabled="isDisabledEdit && !scope.row.is_new_add ? true : false" @input.native="inputChange(scope.$index)"><template slot="append">元</template></el-input>
          <div class="error" v-if="scope.row.price_sale_error">{{scope.row.price_sale_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="单人最大购买数" width="130">
        <template slot-scope="scope">
          <el-input v-model="scope.row.max_num_pp" size="small" class="my-input" :disabled="isDisabledEdit && !scope.row.is_new_add ? true : false" @input.native="inputChange(scope.$index)"><template slot="append">件</template></el-input>
          <div class="error" v-if="scope.row.max_num_pp_error">{{scope.row.max_num_pp_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.stock_num" size="small" class="my-input" @input.native="inputChange(scope.$index)"><template slot="append">件</template></el-input>
          <div class="error" v-if="scope.row.stock_num_error">{{scope.row.stock_num_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="100">
        <template slot-scope="scope">
          <el-input v-model="scope.row.rank" size="small" @input.native="inputChange(scope.$index)"/>
          <div class="error" v-if="scope.row.rank_error">{{scope.row.rank_error}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.is_edit && detail.detail.id">
            <a href="javascript:void(0);" class="confirm" @click="confirmEditItem(scope.$index)">确定</a>
            <a href="javascript:void(0);" class="cancel" v-if="scope.row.id" @click="cancelEditItem(scope.$index)">取消</a>
            <a href="javascript:void(0);" class="confirm" v-else @click="cancelEditItem(scope.$index)">移除</a>
          </template>
          <my-table-operate
            v-else
            :list="[
              {
                title: '修改商品',
                isDisplay: false && auth.isAdmin || auth.GroupActivityItemEdit, //暂不显示
                command: () => handleShowAddEdit('AddEditGroupItem', { ...scope.row, is_disabled_edit_price: (isDisabledEdit && !scope.row.is_new_add ? true : false)})
              },
              {
                title: '移除',
                isDisplay: !isDisabledEdit || scope.row.is_new_add,
                command: () => deleteItem(scope.$index)
              },
            ]"
          />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer" v-if="!isDisabledEdit">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Verification, DataHandle } from '@/util';
import { SearchGroupItem, TableOperate } from '@/common';

export default {
  name: "AddEditGroupActivity",
  mixins: [addEditMixin],
  components: {
    'my-table-operate': TableOperate,
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
      isDisabledEdit: false, //是否禁止编辑
      isDisabledAddItem: false, //是否禁止新增商品
      selectItemId: '',
      selectItem: {},
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      detailTemp: this.copyJson(initDetail),
      rules: {
        title: [
          { required: true, message: '商品名称不能为空', trigger: 'change' },
        ],
        picker_value: [
          { required: true, validator: validPickerValue, trigger: 'blur' },
        ],
        delivery_date: [
          { required: true, validator: validDeliveryDate, trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    //显示新增修改商品
    handleShowAddEdit(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showAddEdit({
        id: data.item_id,
        is_disabled_edit_price: data.is_disabled_edit_price
      });
    },
    //修改商品后刷新（供商品页面用）
    editItemCallBack(data){
      let { detail } = this;
      for(let i = 0; i < detail.items.length; i++){
        if(detail.items[i].item_id === data.id){
          detail.items[i].item_title = data.title;
          detail.items[i].price_origin = this.returnPrice(data.price_origin);
          detail.items[i].header_price = this.returnPrice(data.advice_header_price);
          detail.items[i].price_sale = this.returnPrice(data.advice_price_sale);
          break;
        }
      }
      this.$data.detail = detail;
    },
    //显示新增修改(重写)
    showAddEdit(data){
      this.$data.selectItemId = '';
      this.$data.selectItem = {};
      
      if(data){
        this.groupActivityDetail(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
        this.judgeIsAllEdit();
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
          rd.detail.is_acitve = rd.detail.status === 'activated' ? true : false
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
            rank: rd.items[i].rank === null ? '' : (rd.items[i].rank).toString()
          }
        }
        this.$data.detail = this.copyJson(rd);
        this.$data.detailTemp = this.copyJson(rd); //保存有用
        this.$data.isShow = true;
        this.judgeIsAllEdit();
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
        province_code: this.$province.code,
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
      //判断是否禁用修改商品价格
      if(!detail.detail.id || detail.detail.progress_status === 'pre'){
        this.$data.isDisabledEdit = false;
      }else{
        this.$data.isDisabledEdit = true;
      }
      //判断是否禁用添加修改商品
      if(!detail.detail.id || detail.detail.progress_status === 'pre' || detail.detail.progress_status === 'ing'){
        this.$data.isDisabledAddItem = false;
      }else{
        this.$data.isDisabledAddItem = true;
      }
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
      //如果是新增，商品列表校验不通过
      if(!detail.detail.id && !this.judgeItems()){
        return;
      }

      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.detail.id ? 'groupActivityEdit' : 'groupActivityAdd'], {
        province_code: this.$province.code,
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
        rank: '',
        is_new_add: true, //新加入
        is_edit: true, //编辑
      });
      this.$data.detail = detail;
      this.$data.selectItemId = '';
      this.$data.selectItem = {};
    },
    //移除商品
    deleteItem(index){
      let { detail } = this;
      if(!detail.detail.id){
        detail.items.remove(index);
        this.$data.detail = this.copyJson(detail);
        this.$data.detailTemp = this.copyJson(detail);
        return;
      }
      this.$messageBox.confirm(`您确认移除商品？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        (async ()=>{
          this.$loading({isShow: true});
          let res = await Http.post(Config.api.groupActivityActItemDelete, {
            id: detail.items[index].id
          });
          this.$loading({isShow: false});
          if(res.code === 0){
            this.$message({message: '商品已移除', type: 'success'});
            detail.items.remove(index);
            this.$data.detail = this.copyJson(detail);
            this.$data.detailTemp = this.copyJson(detail);
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
        }else if(Number(item.header_price) === 0){
          item.header_price_error = '金额不能为0';
          isPass = false;
        }else{
          item.header_price_error = '';
        }

        //判断团购价
        if(!item.price_sale){
          item.price_sale_error = '团购价不能空';
          isPass = false;
        }else if(!Verification.isPrice(item.price_sale)){
          item.price_sale_error = '金额不正确';
          isPass = false;
        }else if(Number(item.price_sale_error) === '0'){
          item.price_sale_error = '金额不能为0';
          isPass = false;
        }else if(Number(item.price_sale) < Number(item.header_price)){
          item.price_sale_error = '不能小于团长价';
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
            rank: item.rank === '' ? null : Number(item.rank)
          });
        }
      }
      this.$data.detail = this.copyJson(detail);
      return isPass;
    },
    //表格输入
    inputChange(index){
      let { detail, auth } = this;
      if(!detail.items[index].is_edit && (auth.isAdmin || auth.GroupActivityEdit)){
        detail.items[index].is_edit = true;
        this.$data.detail = this.copyJson(detail);
      }
    },
    //确认商品(新增、修改)
    async confirmEditItem(index){
      if(!this.judgeItems(index)) return;

      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.items[index].id ? 'groupActivityActItemEdit' : 'groupActivityActItemAdd'], {
        activity_id: detail.detail.id || '',
        ...detail.items[index],
        header_price: this.handlePrice(detail.items[index].header_price),
        price_sale: this.handlePrice(detail.items[index].price_sale),
        max_num_pp: Number(detail.items[index].max_num_pp),
        stock_num: Number(detail.items[index].stock_num),
        rank: detail.items[index].rank === '' ? null : Number(detail.items[index].rank)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `商品${detail.items[index].id ? '修改' : '新增'}成功`, type: 'success'});
        detail.items[index].id = res.data.id;
        detail.items[index].is_edit = false;
        detail.items[index].is_new_add = false;
        this.$data.detail = detail;
        this.$data.detailTemp = this.copyJson(detail);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //取消商品(取消、移除)
    cancelEditItem(index){
      let { detail, detailTemp } = this;
      if(detail.items[index].id){
        detail.items[index] = this.copyJson(detailTemp.items[index]);
        detail.items[index].is_edit = false;
      }else{
        detail.items.remove(index);
      }
      this.$data.detail = this.copyJson(detail);
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
    z-index: 1;
  }
  .confirm, .cancel{
    font-size: 12px;
    display: block;
    text-decoration: underline;
    &.cancel{
      color: #999;
    }
    &:hover{
      font-weight: bold;
    }
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
