<template>
  <div>
    <!-- 选择片区 -->
    <div style="display: flex; align-items: center;">
      <my-select-zone
        style="width: 200px"
        :provinceCode="provinceCode"
        v-model="query.zone_id"
        @change="selectByCondition"
        clearable
      ></my-select-zone>
      <my-select-city
        style="width: 200px; margin-left: 10px"
        :provinceCode="provinceCode"
        :zoneId="query.zone_id"
        v-model="query.city_id"
        @change="selectByCondition"
      >
      </my-select-city>
      <el-input v-model="query.condition" style="width: 200px; margin: 0 10px;" placeholder="输入商户名称搜索" clearable @keyup.enter.native="selectByCondition" />
      <el-button type="primary" icon="el-icon-search" @click="selectByCondition"></el-button>
      <el-button type="primary" plain style="margin-left: 10px;" @click="clearQueryCondition">重置</el-button>
    </div>
    <!-- 输入名称 -->
    <div style="display: flex; align-items: center; margin-top: 20px;">
      <ul class="select-list">
        <li class="header">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllItems">全选</el-checkbox>
        </li>
        <li style="margin-top: 40px;">
          <el-checkbox-group v-model="multipleSelection" @change="handleCheckedItemsChange">
            <ul style="padding: 0 10px;">
              <li v-for="item in showList">
                <el-checkbox :label="item" :key="item.code">{{item.title}}</el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </li>
      </ul>
      <ul class="into-out" style="margin: 0 50px;">
        <li><i class="el-icon-d-arrow-right" @click="intoEditList"></i></li>
      </ul>
      <el-table :data="editList" height="400px" style="border: 1px solid #DCDFE6; border-radius: 2px;" :row-class-name="highlightRowClassName">
        <el-table-column label="已添加的商户列表" prop="title"></el-table-column>
        <el-table-column label="操作" width="60" align="center">
          <template slot-scope="scope">
            <ul class="table-action">
              <li><a href="javascript:void(0);" @click="handleRemoveItem(scope.row)">移除</a></li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { Table, TableColumn, Input, Button, Pagination, Checkbox, CheckboxGroup, Message } from 'element-ui';
  import { SelectCity } from '@/component/select';
  import { SelectZone } from '@/common';
  import { Http, Config } from '@/util';
  export default {
    name: "SearchMerchant",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-checkbox': Checkbox,
      'el-checkbox-group': CheckboxGroup,
      'my-select-zone': SelectZone,
      'my-select-city': SelectCity,
    },
    props: {
      merchantList: { type: Array, required: true },
      provinceCode: { type: String | Number, required: true },
      height: { type: String, default: '60vh' }
    },
    model: {
      prop: 'merchantList',
      event: 'change'
    },
    computed: {
      showList: {
        // 如果筛选到的itemList不在右侧编辑中的列表中editList，则填充在showList中显示出来。
        get() {
          return this.$data.itemList.filter(item => !this.$data.editList.some(editItem => editItem.code === item.code));
        }
      }
    },
    data() {
      return {
        query: {
          province_code: this.$props.provinceCode,
          zone_id: '', // 片区code
          city_id: '', // 县域code
          condition: '',
        },
        // 搜索完毕后，获取搜索到的列表itemList，
        itemList: [],
        isIndeterminate: true, // 表示不确定。 介于 已经全选 和 未选择 之间。
        checkAll: false, // 是否全选？ 如果全选，则 multipleSelection = showList; 否则向 multipleSelection 中一个一个添加
        multipleSelection: [],  // 多选列表
        editList: [], // 需要编辑的列表
      }
    },
    created() {
      this.queryMerchant();
    },
    methods: {

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },


      /**
       * 根据查询条件，查询结果。
       * 1、如果没有输入查询条件，点击了搜索按钮，则初始化状态
       * 2、查询到列表后，初始化已选中的列表，重置isIndeterminate为true
       */
      selectByCondition() {
        // 如果查询列表没有搜索参数，则初始化状态。
        if (!this.$data.query.zone_id
          && !this.$data.query.city_id
          && !this.$data.query.condition) {
          this.$data.itemList = [];
          this.$data.multipleSelection = [];
          this.isIndeterminate = true;
          return;
        }

        this.queryMerchant();
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
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.$props.provinceCode,
          zone_id: '',
          city_id: '',
          condition: ''
        })
        this.$data.itemList = [];
        this.$data.multipleSelection = [];
        this.isIndeterminate = true;

        this.queryMerchant();
      },

      /**
       * 全选所有 的 响应事件
       * 1、赋值商户列表 到 选中的商户列表中
       * 2、设置isIndeterminate为false
       */
      handleCheckAllItems(val) {
        // 如果是全选，则将所有的显示出来的门店，存放在已选中列表中。
        this.$data.multipleSelection = val ? this.showList : [];
        this.isIndeterminate = false;
      },

      /**
       * 选中单个商户 的 响应事件
       * 1、组件自动将选中的门店列表 赋值给 this.$data.multipleSelection
       * 2、根据选中的数量判断 是否全选
       * 3、根据选中的数量 判断 isIndeterminate的值
       */
      handleCheckedItemsChange(value) {
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
          Message.warning('请先筛选指定商户!');
          return;
        }

        let multipleSelection = this.$data.multipleSelection.map(item => {
          return item;
        })

        this.$data.editList = [...this.$data.editList, ...multipleSelection];

        // 每次添加成功后，清空多选列表的数据
        this.$data.multipleSelection = [];
        this.$emit('change', this.$data.editList);
      },

      /**
       * 从编辑区移除
       * 1、将选中的项从右侧编辑区列表移除
       * 2、computed属性，会自动计算需要在左侧显示的列表
       */
      handleRemoveItem(item) {
        // 从编辑列表删除
        this.$data.editList = this.$data.editList.filter(t => t.code !== item.code);
        this.$emit('change', this.$data.editList);
      },

      async queryMerchant() {
        let res = await Http.get(Config.api.baseMerchantList, this.$data.query);
        if (res.code === 0) {
          // console.log('res.data', res.data);
          this.$data.itemList = res.data.map(item => ({ code: item.id, title: item.title }));
        } else {
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
