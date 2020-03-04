<template>
  <el-form :model="submitData" style="width: 1150px;" :rules="rules" ref="ruleForm">
    <el-form-item>
      <div style="display: flex;">
        <my-query-item>
          <my-select-line
            :provinceCode="province.code"
            v-model="query.line_id"
            style="width: 180px;"
            size="small"
            @change="selectByCondition"
          />
        </my-query-item>
        <my-query-item>
          <my-select-city
            size="small"
            :provinceCode="province.code"
            :lineCode="query.line_id"
            v-model="query.city_id"
            style="width: 180px; margin-left: 20px;"
            @change="selectByCondition"
          />
        </my-query-item>
        <my-query-item>
          <el-input
            size="small"
            style="width: 180px; margin-left: 20px;"
            v-model="query.store_title"
            clearable
            placeholder="输入门店名称"
            @keyup.enter.native="selectByCondition"
            @clear="selectByCondition"
            ref="store_title"
          />
          <el-button size="small" style="margin-left: 4px;"  type="primary" icon="el-icon-search" @click="selectByCondition"></el-button>
          <el-button size="small" type="primary" plain style="margin-left: 10px;" @click="clearQueryCondition">重置</el-button>
        </my-query-item>
      </div>
    </el-form-item>
    <el-form-item :error="error.stores">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <ul class="select-list">
          <li class="header">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllStores">全选</el-checkbox>
          </li>
          <li style="margin-top: 40px;">
            <el-checkbox-group v-model="multipleSelection" @change="handleCheckedStoresChange">
              <ul style="padding: 0 10px;">
                <li v-for="store in showList">
                  <el-checkbox :label="store" :key="store.id">{{store.title}}</el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </li>
        </ul>
        <ul class="into-out">
          <li><i class="el-icon-d-arrow-right" @click="intoEditList"></i></li>
        </ul>
        <ul class="edit-list">
          <li class="header">
            <ul style="display: flex; justify-content: space-between; align-items: center;">
              <li class="title">门店</li>
              <li class="frame-num">剩余筐数</li>
              <li class="return-num">退筐数量</li>
              <li class="frame-amount">剩余金额</li>
              <li class="return-amount">退筐金额(元)</li>
              <li class="operate">操作</li>
            </ul>
          </li>
          <li class="item" style="margin-top: 44px;">
            <ul
              :class="index % 2 === 0 ? 'stripe' : ''"
              v-for="(item, index) in submitData.editList"
              :key="index"
            >
              <li class="title">{{ item.title }}</li>
              <li class="frame-num">{{ item.frame_num }}</li>
              <li class="return-num">
                <el-form-item
                  :prop="'editList.' + index + '.return_num'"
                  :rules="[{ validator: validReturnNum, trigger: 'blur' }]"
                >
                  <el-input size="mini" style="width: 150px;" v-model="item.return_num" @input="changeReturnNum(item, index)"></el-input>
                </el-form-item>
              </li>
              <li class="frame-amount"><my-to-price :amount="item.frame_amount" /></li>
              <li class="return-amount">
                <el-form-item
                  :prop="'editList.' + index + '.return_amount'"
                  :rules="[{ validator: validNumAndAmount, trigger: 'change' }, { validator: validReturnAmount, trigger: 'blur' }]"
                >
                  <el-input size="mini" style="width: 150px;" v-model="item.return_amount"></el-input>
                </el-form-item>
              </li>
              <li class="operate">
                <ul class="action">
                  <li><a href="javascript:void(0);" v-if="item.isEditing === false"
                         @click="scope.row.isEditing = true">修改</a></li>
                  <li><a href="javascript:void(0);" @click="handleRemoveClick(item, index)">移除</a></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </el-form-item>
    <el-form-item prop="remark" label="备注">
      <el-input v-model="submitData.remark" placeholder="请输入备注..." type="textarea" :rows="5" resize="none"></el-input>
    </el-form-item>
    <el-form-item style="display: flex; justify-content: flex-end;">
      <el-button @click="() => this.$props.closeDialog()">取消</el-button>
      <el-button type="primary" :loading="isSending" @click="handleSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { Input, Checkbox, CheckboxGroup, Table, TableColumn, Form, FormItem, Button, Message } from 'element-ui';
  import { ToPrice, QueryItem } from '@/common';
  import { SelectLine, SelectCity } from '@/container';
  import { Http, Config, DataHandle, Verification } from '@/util';

  export default {
    name: "OperateRefundAddStore",
    components: {
      'el-input': Input,
      'el-checkbox': Checkbox,
      'el-checkbox-group': CheckboxGroup,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'my-select-line': SelectLine,
      'my-select-city': SelectCity,
      'my-to-price': ToPrice,
      'my-query-item': QueryItem
    },
    computed: {
      showList: {
        // 如果筛选到的城市storeList不在右侧编辑中的列表中editList，则填充在showList中显示出来。
        get() {
          return this.$data.storeList.filter(store => !this.$data.submitData.editList.some(item => item.id === store.id));
        }
      }
    },
    props: {
      closeDialog: Function,
      callback: Function
    },
    data() {
      let submitData = {
        remark: '',
        editList: []
      };
      return {
        province: this.$province,
        auth: this.$auth,
        // 查询门店
        query: {},
        // 搜索完毕后，获取搜索到的城市列表storeList，
        storeList: [],
        isIndeterminate: true, // 表示不确定。 介于 已经全选 和 未选择 之间。
        checkAll: false, // 是否全选？ 如果全选，则 multipleSelection = showList; 否则向 multipleSelection 中一个一个添加
        multipleSelection: [],  // 多选列表
        submitData: submitData,
        isSending: false,
        rules: {
          remark: [
            { max: 200, message: '不能超过200个字符，请重新编辑', trigger: 'change' }
          ]
        },
        error: {
          stores: ''
        }
      }
    },
    created() {
      this.initQuery();
    },
    methods: {
      initQuery() {
        this.$data.query = Object.assign(this.$data.query, {
          province_code: this.province.code,
          line_id: '',
          city_id: '',
          store_title: ''
        });
      },

      validReturnNum(rules, value, callback) {
        let strList = rules.field.split(".");
        let index = Number(strList[1]);
        let frame_num = this.$data.submitData.editList[index].frame_num;
        value = this.$data.submitData.editList[index].return_num;

        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('退筐数量必须为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('退筐数量必须为整数'));
        }
        if (value > 100000) {
          return callback(new Error('退筐数量不能超过100000'));
        }
        if (value > frame_num) {
          return callback(new Error('退筐数量不能大于剩余筐数'));
        }
        callback();
      },

      validNumAndAmount(rules, value, callback) {
        let strList = rules.field.split(".");
        let index = Number(strList[1]);
        let return_num = this.$data.submitData.editList[index].return_num;
        value = this.$data.submitData.editList[index].return_amount;
        if (!return_num && !value) {
          return callback(new Error('退筐数量和退筐金额不能同时为空'));
        }
        callback();
      },

      validReturnAmount(rules, value, callback) {
        let strList = rules.field.split(".");
        let index = Number(strList[1]);
        let frame_amount = this.$data.submitData.editList[index].frame_amount;
        value = this.$data.submitData.editList[index].return_amount;

        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('退筐金额必须为大于零的纯数字'));
        }
        if (!!value && !/^[0-9]+([.]\d{0,2})?$/.test(value)) {
          return callback(new Error('退筐金额最多只能输入两位小数'));
        }
        if (value > 1000000) {
          return callback(new Error('退筐金额不能超过1000000'));
        }
        if (DataHandle.handlePrice(value) > frame_amount) {
          return callback(new Error('退筐金额不能大于剩余金额'));
        }
        callback();
      },

      //返回金额
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },

      handlePrice(price) {
        return DataHandle.handlePrice(price);
      },

      /**
       * 根据查询条件，查询结果。
       * 1、如果没有输入查询条件，点击了搜索按钮，则初始化状态
       * 2、查询门店列表后，初始化已选中的门店列表，重置isIndeterminate为true
       */
      selectByCondition() {
        // 如果查询列表没有搜索参数，则初始化状态。
        if (!this.$data.query.line_id
            && !this.$data.query.city_id
            && !this.$data.query.store_title) {
          this.$data.storeList = [];
          this.$data.multipleSelection = [];
          this.isIndeterminate = true;

          return;
        }

        this.refundStoreList();
        this.$data.multipleSelection = [];
        this.isIndeterminate = true;
      },

      /**
       * 重置按钮响应事件
       * 1、重置查询条件
       * 2、清空查询到的门店列表
       * 3、清空已经选中的门店列表
       * 4、重置isIndeterminate为true
       *
       */
      clearQueryCondition() {
        this.initQuery();
        this.$data.storeList = [];
        this.$data.multipleSelection = [];
        this.isIndeterminate = true;
        this.$refs['store_title'].currentValue = '';
      },

      /**
       * 全选所有门店 的 响应事件
       * 1、赋值门店列表 到 选中的门店列表中
       * 2、设置isIndeterminate为false
       */
      handleCheckAllStores(val) {
        // 如果是全选，则将所有的显示出来的门店，存放在已选中列表中。
        this.$data.multipleSelection = val ? this.showList : [];
        this.isIndeterminate = false;
      },

      /**
       * 选中单个门店 的 响应事件
       * 1、组件自动将选中的门店列表 赋值给 this.$data.multipleSelection
       * 2、根据选中的数量判断 是否全选
       * 3、根据选中的数量 判断 isIndeterminate的值
       */
      handleCheckedStoresChange(value) {
        let checkedCount = value.length;
        // 是否全部选中的判断
        this.$data.checkAll = checkedCount === this.showList.length;
        // 选择个数 大于零 但小于 所有显示的门店，则表示未确认
        this.$data.isIndeterminate = checkedCount > 0 && checkedCount < this.showList.length;
      },

      /**
       * 添加到编辑列表的响应事件
       * 1、如果所选列表为空，则提醒先选择门店，并返回；
       * 2、合并编辑区列表 和 选中列表，并初始化编辑区列表的字段
       * 3、添加完成后，初始化已经选中的列表状态
       */
      intoEditList() {
        if (this.$data.multipleSelection.length === 0) {
          this.$data.error.stores = '请先筛选需要编辑的门店';
          return;
        }

        this.$data.multipleSelection = this.$data.multipleSelection.map(item => {
          return Object.assign(item, {isEditing: true, return_num: '', return_amount: ''});
        })
        this.$data.submitData.editList = [...this.$data.submitData.editList, ...this.$data.multipleSelection];

        // 每次添加成功后，清空多选列表的数据
        this.$data.multipleSelection = [];
        this.$data.error.stores = ''; // 还原错误消息。
      },

      // 默认为退筐计价
      changeReturnNum(item, index) {
        if (!!item.return_num && (isNaN(item.return_num) || item.return_num <= 0)) {
          return;
        }
        if (item.return_num) {
          item.return_amount = item.return_num * 25;
        } else {
          item.return_amount = '';
        }
        this.$set(this.$data.submitData.editList, index, item);
      },

      /**
       * 从编辑区移除门店
       * 1、将选中的门店从右侧编辑区列表移除
       * 2、computed属性，会自动计算需要在左侧显示的门店列表
       */
      handleRemoveClick(item, index) {
        let prop_return_num = 'editList.' + index + '.return_num';
        let prop_return_amount = 'editList.' + index + '.return_amount';
        // this.$refs['ruleForm'].clearValidate([prop_return_num, prop_return_amount]);
        // 从编辑列表删除
        this.$data.submitData.editList = this.$data.submitData.editList.filter(t => t.id !== item.id);
      },

      // 获取退筐的门店列表
      async refundStoreList() {
        let res = await Http.get(Config.api.operateRefundStoreList, this.query);
        if (res.code === 0) {
          this.$data.storeList = res.data.stores;
        } else {
          Message.warning(res.message);
        }
      },

      handleSubmit() {
        if (this.$data.submitData.editList.length <= 0) {
          this.$data.error.stores = '请先添加需要编辑的门店';
          return;
        }

        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.addRefundStore();
          }
        })
        // let ruleForm = this.$refs.ruleForm;
        // if (ruleForm.fields.some(item => item.validateState === '')) { // 表示有项目没有被验证
        //   ruleForm.validate();
        // } else {
        //   if (ruleForm.fields.some(item => item.validateState === 'error')) { // 表示有项目没有通过验证
        //
        //   } else {
        //     this.addRefundStore();
        //   }
        // }
      },

      async addRefundStore() {

        this.$data.isSending = true;
        let stores = this.$data.submitData.editList.map(item => {
          return {
            store_id: item.id,
            return_amount: this.handlePrice(item.return_amount),
            return_num: Number(item.return_num) || 0  // 如果没有输入退筐数量，则默认值为0
          }
        });
        let remark = this.$data.submitData.remark;

        let res = await Http.post(Config.api.operateRefundStoreReturn, { stores, remark });
        if (res.code === 0) {
          Message.success('新增退筐门店成功！');
          this.$data.isSending = false;
          // 将编辑区的所有门店状态 设置为 非编辑模式。
          this.$data.submitData.editList = this.$data.submitData.editList.map(item => {
            item.isEditing = false;
            return item;
          })
          this.$props.callback();
          this.$props.closeDialog();
        } else {
          this.$data.isSending = false;
          Message.warning(res.message);
        }
      },

    }
  }
</script>

<style lang="scss" scoped>
  .select-list {
    height: 400px;
    width: 200px;
    overflow: auto;
    border-radius: 2px;
    border: 1px solid #DCDFE6;
  }
  .select-list > .header {
    padding: 0px 10px;
    border-bottom: 1px solid #DCDFE6;
    position: absolute;
    background-color: #fff;
    width: 180px;
    z-index: 99;
    padding-left: 10px;
  }

  .edit-list {
    width: 880px;
    height: 400px;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    overflow: auto;
  }

  .edit-list > .header {
    height: 44px;
    color: #3B3D42;
    font-weight: 500;
    position: absolute;
    background-color: #fff;
    z-index: 99;
    width: 880px;
    border-bottom: 1px solid #DCDFE6;
  }

  .edit-list > .item > ul {
    padding: 10px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .edit-list > .item > ul.stripe {
    background-color: #FBFBFD;
  }

  .edit-list .title {
    padding: 0 10px;
    width: 220px;
  }

  .edit-list .frame-num {
    width: 80px;
  }

  .edit-list .return-num {
    width: 210px;
  }

  .edit-list .frame-amount {
    width: 100px;
  }

  .edit-list .return-amount {
    width: 210px;
  }

  .edit-list .operate {
    width: 40px;
  }

  .action {
    display: flex;

    li {
      margin-right: 5px;
    }

    a {
      font-size: 12px;
      text-decoration: underline;
    }

    a:hover {
      font-weight: 900;
    }
  }

  .into-out {
    i {
      cursor: pointer;
      font-size: 30px;
      color: #999999;
    }

    i:hover {
      color: #666;
    }

  }
</style>
