<template>
  <div @mousemove="handleTableMouseMove">
    <el-table
      class="list-table my-table-float"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :data="data"
      :row-class-name="highlightRowClassName"
      highlight-current-row="highlight-current-row"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize <= 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="title" min-width="160">
        <template slot-scope="scope">
          <a href="javascript:void(0);"
             v-if="auth.isAdmin || auth.GroupBuyDetail"
             class="title"
             @click="handleShowItem(scope.row)">
            {{ scope.row.code }} / {{ scope.row.title }}
          </a>
          <div v-else class="title-disable" >
            {{ scope.row.code }} / {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="coupon_type" min-width="120">
        <template slot-scope="scope">
          <div>
            {{ scope.row.start_time }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="status" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.end_time }}</div>
        </template>
      </el-table-column>
      <el-table-column label="团购状态" prop="is_auto_dis" min-width="80">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="statusTagType[scope.row.progress_status]"
            disable-transitions
          >
            {{ groupBuyProgressStatus(scope.row.progress_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" prop="is_auto_dis" min-width="80">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="statusTagType[scope.row.status]"
            disable-transitions
          >
            {{ groupBuyStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="下单数" prop="is_auto_dis" min-width="80">-->
        <!--<template slot-scope="scope">-->
          <!--<div>{{ scope.row.order_num }}</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--未生效：生效、删除、编辑；   已生效：结束、编辑-->
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
            {
              title: '上架',
              isDisplay: (auth.isAdmin || auth.GroupBuyActive) && (scope.row.status === 'deactivated' && scope.row.progress_status !== 'post'),
              command: () => handleActive(scope.row)
            },
            {
              title: '下架',
              isDisplay: (auth.isAdmin || auth.GroupBuyCancel) && (scope.row.status === 'activated' && scope.row.progress_status !== 'post'),
              command: () => handleCancel(scope.row)
            },
            {
              title: '复制',
              isDisplay: auth.isAdmin || auth.GroupBuyCopy,
              command: () => handleCopyItem(scope.row)
            },
            {
              title: '修改',
              isDisplay: (auth.isAdmin || auth.GroupBuyEdit) && (scope.row.progress_status !== 'post'),
              command: () => handleEdit(scope.row)
            }
          ]"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import {TableOperate} from '@/common';
  import { Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  
  export default {
    name: "TableGroupBuy",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      data: { type: Array, required: true},
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      offsetHeight: { type: Number, required: true},
      showItem: { type: Function, required: true },
      copyItem: { type: Function, required: true },
      active: { type: Function, required: true },
      cancel: { type: Function, required: true },
      delete: { type: Function, required: true },
      edit: { type: Function, required: true },
    },
    computed: {
    },
    created() {
      // console.log('TableGroupBuy: ', this.data)
    },
    data() {
      return {
        statusTagType: {
          pre: 'warning',
          ing: '',
          post: 'info',
          activated: 'regular',
          deactivated: 'info'
        },
      }
    },
    methods: {

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

      groupBuyStatus(status) {
        if (status === 'activated') {
          return '已上架'
        } else if (status === 'deactivated') {
          return '未上架'
        } else {
          return ''
        }
      },

      groupBuyProgressStatus(status) {
        if (status === 'pre') {
          return '未开展'
        } else if (status === 'ing') {
          return '团购中'
        } else if (status === 'post') {
          return '已结束'
        } else {
          return ''
        }
      },

      handleShowItem(row) {
        this.$props.showItem(row);
      },

      handleCopyItem(item) {
        this.$props.copyItem(item);
      },

      //生效
      handleActive(row) {
        this.$props.active(row);
      },

      //取消
      handleCancel(row) {
        this.$props.cancel(row);
      },

      //删除
      handleDelete(row) {
        this.$props.delete(row);
      },

      //编辑
      handleEdit(row) {
        this.$props.edit(row);
      },

    }
  }
</script>

<style scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
  .title-disable {
    color: inherit;
    padding: 5px 10px 5px 0;
  }
</style>
