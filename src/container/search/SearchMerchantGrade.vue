<template>
  <div style="display: flex; align-items: center;">
    <el-select
      style="width: 100%;"
      v-model="selectedList"
      multiple
      filterable
      allow-create
      default-first-option
      placeholder="请选择商户等级"
      @change="changeSelectList"
    >
      <el-option
        v-for="item in listItem"
        :key="item.code"
        :label="item.title"
        :value="item.code">
      </el-option>
    </el-select>

  </div>

</template>

<script>
  import { Table, TableColumn, Button, Select, Option, Message } from 'element-ui';
  import { Http, Config } from '@/util';

  export default {
    name: "SearchMerchantGrade",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-select': Select,
      'el-option': Option
    },
    props: {
      gradeList: { type: Array, required: true },
      height: { type: String, default: '30vh' }
    },
    model: {
      prop: 'gradeList',
      event: 'change'
    },
    data() {
      return {
        listItem: [], // 查询到的城市列表
        multipleSelection: [], // 操作选择的城市
        selectedList: [], // 确认选中的的城市列表
      }
    },
    created() {
      this.queryGrade();
    },
    methods: {

      changeSelectList() {
        // console.log('this.$data.selectedList', this.$data.selectedList);
        this.$emit('change', this.$data.listItem.filter( item => this.$data.selectedList.some(gradeCode => gradeCode === item.code )));
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

      handleSelectionChange(val) {
        this.$data.multipleSelection = val;
      },

      intoSelectedList() {

        if (this.$data.multipleSelection.length === 0) {
          Message.warning('请先筛选需要添加的商户等级!');
          return;
        }
        // 合并到右侧选中列表
        this.$data.selectedList = this.$data.multipleSelection;
        this.$emit('change', this.$data.selectedList);
      },

      handleRemoveSelectedItem(item) {
        this.$data.selectedList = this.$data.selectedList.filter(i => i.code !== item.code);
        this.toggleSelection(this.$data.multipleSelection.filter(i => i.code === item.code)); // 切换已选中行的状态
        this.$emit('change', this.$data.selectedList);
      },

      async queryGrade() {
        let res = await Http.get(Config.api.baseMerchantGradeList, {});
        if (res.code === 0) {
          this.$data.listItem = res.data;
        } else {
          Message.warning(res.message);
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
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
