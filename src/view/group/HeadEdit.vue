<template>
  <el-dialog :title="showType === 'add' ? '新增团购门店' : '新增团长'" :visible.sync="isShow" width="680px" append-to-body :close-on-click-modal="false">
      <el-form :model="editItem" v-if="isShow" style="width: 580px;" label-position="right" label-width="120px" ref="ruleForm">
        <el-form-item v-if="showType === 'add'" label="请选择门店" prop="store_id" :rules="[{ required: true, message: '请选择门店', trigger: 'change' }]">
          <el-select
            style="width: 100%"
            clearable
            v-model="editItem.store_id"
            @change="handleStoreChange"
            filterable
            remote
            :remote-method="queryChangeAsync"
            no-match-text="没有找到符合搜索条件的门店"
            no-data-text="没有找到符合搜索条件的门店"
          >
            <i style="margin-left: 5px;" slot="prefix" class="el-icon-search"></i>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :value="item.id"
              :label="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input :value="detail.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input :value="detail.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input :value="detail.address" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="请选择团长"
          v-if="detail.id"
          prop="member_ids"
          :rules="[{ type: 'array', required: true,  message: '请选择团长', trigger: 'change' }]"
        >
          <el-row v-for="(item, index) in selectMembers" :key="index" style="margin-bottom: 10px;">
            <el-col :span="11">
              <el-select style="width: 100%" :value="selectMembers[index].id" @change="(id)=>changeMember(id, index)">
                <el-option
                  v-for="(m, i) in detail.members"
                  :key="m.id + '_' + i + '_' + index"
                  :value="m.id"
                  :label="m.realname_temp"
                  :disabled="m.is_header || m.is_freeze || m.is_freeze_header || m.is_select"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="10">
              <el-input :value="item.phone" disabled placeholder="登录手机"></el-input>
            </el-col>
            <el-col :span="2" class="t-r"><a v-if="index > 0" href="javascript:void(0);" @click="deleteMember(index)">删除</a></el-col>
          </el-row>
          <div class="rule-plus" @click="addMember" v-if="isShowAddMember()">
            <i class="el-icon-circle-plus icon-button" style="margin-left: -5px;"></i>
            <span>继续增加团长</span>
          </div>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button plain @click="handleClose">取消</el-button>
          <el-button type="primary" :loading="loading" @click.prevent="handleSubmit">确认</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { Form, FormItem, Row, Col, Button, Input, Autocomplete, Select, Option, Dialog } from "element-ui";
import { Base, Group } from "@/service";

export default {
  name: "HeadEdit",
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-row": Row,
    "el-col": Col,
    "el-button": Button,
    "el-input": Input,
    "el-autocomplete": Autocomplete,
    "el-select": Select,
    "el-option": Option,
    'el-dialog': Dialog
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
  },
  computed: {
    ...mapGetters({
      province: "globalProvince"
    })
  },
  data() {
    return {
      showType: 'add',
      isShow: false,
      storeList: [],
      detail: {
        members: []
      },
      selectMembers: [{
        id: '',
        phone: ''
      }],
      editItem: {
        store_id: '',
        member_ids: []
      },
      loading: false
    };
  },
  created() {},
  methods: {
    //初始化数据
    initData(){
      Object.assign(this.$data, this.$options.data());
    },
    //显示新增及修改
    showAddEdit(data){
      this.initData();
      if(data){
        let rd = this.setMembersStatus(data);
        this.$data.detail = rd;
        this.$data.editItem.store_id = data.id;
        this.$data.showType = 'edit';
        this.$data.isShow = true;
      }
      this.$data.isShow = true;
    },
    //关闭
    handleClose(){
      this.$data.isShow = false;
    },
    //用户状态
    setMembersStatus(detail){
      let mIds = [];
      let ms = detail.members.map(item => {
        let str = "";
        if (item.is_freeze) {
          str = "(已冻结)";
        }else if (item.is_header) {
          str = "(已绑定)";
        }else if (item.is_freeze_header) {
          str = "(已冻结)";
        }else if (item.is_select) {
          mIds.push(item.id);
        }
        item.realname_temp = item.realname + str;
        return item;
      });
      this.$data.editItem.member_ids = mIds;
      return{
        ...detail,
        members: ms
      }
    },
    //是否显示继续添加团长
    isShowAddMember(){
      let ms = this.detail.members.filter(
        item => !item.is_header && !item.is_freeze && !item.is_freeze_header
      );
      return ms.length > this.selectMembers.length ? true : false;
    },
    //继续添加团长
    addMember(){
      let { selectMembers } = this;
      selectMembers.push({
        id: '',
        phone: ''
      });
      this.$data.selectMembers = selectMembers;
    },
    //选择用户
    changeMember(id, index){
      let { selectMembers, detail } = this;
      let tempId = selectMembers[index].id;
      for(let i = 0; i < detail.members.length; i++){
        if(detail.members[i].id === id){
          detail.members[i].is_select = true;
          selectMembers[index] = detail.members[i];
        }
        if(tempId === detail.members[i].id){
          detail.members[i].is_select = false;
        }
      }
      this.$data.selectMembers = selectMembers;
      detail = this.setMembersStatus(detail);
      this.$data.detail = detail;
      this.$forceUpdate();
    },
    //删除用户
    deleteMember(index){
      let { selectMembers, detail } = this;
      if(selectMembers[index].id){
        for(let i = 0; i < detail.members.length; i++){
          if(detail.members[i].id === selectMembers[index].id){
            detail.members[i].is_select = false;
            break;
          }
        }
        detail = this.setMembersStatus(detail);
        this.$data.detail = detail;
      }
      selectMembers.remove(index);
      this.$data.selectMembers = selectMembers;
      this.$forceUpdate();
    },
    // 输入条件更新后的响应事件
    async queryChangeAsync(condition) {
      if (!condition) {
        this.$data.storeList = [];
        return;
      }
      let res = await Base.baseStoreList({
        province_code: this.province.code,
        condition: condition
      });
      if (res.code === 0) {
        let rd = res.data.map(item => {
          // 去除已冻结 或 已绑定的门店
          if(item.is_freeze) {
            item.title = item.title + "(已冻结)";
          }else if (item.gb_included) {
            item.title = item.title + "(已绑定)";
          }
          return {
            id: item.id,
            value: item.title,
            disabled: item.gb_included || item.is_freeze
          };
        });
        this.$data.storeList = rd;
      } else {
        this.$data.storeList = [];
        this.$store.dispatch("message", {
          title: "提示",
          message: res.message,
          type: "error"
        });
      }
    },

    // 如果选择的门店发生变化，则重置：已经查询到符合条件的门店列表；该门店的会员列表；已经选中的会员id。
    async handleStoreChange(id) {
      this.$data.storeList = [];
      this.$data.detail.members = [];
      this.$data.editItem.member_ids = [];
      this.$data.selectMembers = [{ id: '', phone: '' }];
      if (!id) {
        return;
      }
      let res = await Group.headStoreDetail({ store_id: id });
      if (res.code === 0) {
        this.$data.editItem.store_id = id;
        let rd = this.setMembersStatus(res.data);
        this.$data.detail = rd;
      } else {
        this.$store.dispatch("message", {
          title: "提示",
          message: res.message,
          type: "error"
        });
      }
    },

    //提交数据
    async handleSubmit() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          this.$data.loading = true;
          let res = await Group.headAdd(this.$data.editItem);
          if (res.code == 0) {
            this.$data.loading = false;
            this.$store.dispatch("message", {
              title: "提示",
              message: "团长新增成功",
              type: "success"
            });
            if(this.showType === 'add'){
              //新增
              let com = this.getPageComponents('HeadList');
              if(com){
                com.changeQuery(); //重新获取列表数据
              }
            }else{
              //修改
              let com = this.getPageComponents('HeadDetail');
              if(com){
                com.groupHeadStoreBindDetail(); //重新获取详情
              }
            }
            this.handleClose(); //关闭
          } else {
            this.$data.loading = false;
            this.$store.dispatch("message", {
              title: "提示",
              message: res.message,
              type: "error"
            });
          }
        }
      });
    },
  }
};
</script>

<style scoped>
.rule-plus {
  width: 120px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
