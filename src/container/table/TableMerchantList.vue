<template>
  <div @mousemove="handleTableMouseMove">
    <el-table
      class="list-table"
      :data="dataItemTemp.items"
      :height="windowHeight - offsetHeight"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :row-class-name="highlightRowClassName"
      :highlight-current-row="true"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <!-- 表格宽度： 860 / 830（带全选） -->
      <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize <= 999950 ? 68 : 88" label="序号" :index="indexMethod">
      </el-table-column>
      <el-table-column label="门店名称" min-width="150" prop="title">
        <template slot-scope="scope">
        <span v-if="auth.isAdmin || auth.MerchantAuditDetail">
          <a :class="`title ${isEllipsis(scope.row)}`" href="javascript:void(0);" @click.prevent="showDetail(scope.row)">
            {{ scope.row.title }}
          </a>
        </span>
          <span v-else :class="isEllipsis(scope.row)">
          {{ scope.row.title }}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称" min-width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.merchant.title}}</div>
        </template>
      </el-table-column>

      <el-table-column label="协议商户" min-width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="scope.row.merchant && scope.row.merchant.is_post_pay ? 'regular' : 'info'" size="small"
          >{{scope.row.merchant && scope.row.merchant.is_post_pay ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所在仓" min-width="80" prop="city.title">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.city && scope.row.city.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="scope.row.is_approve ? 'regular' : 'info'" size="small"
          >{{scope.row.is_approve ? '已审核' : '未审核'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" min-width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions :type="scope.row.is_freeze ? 'regular' : 'info'" size="small"
          >{{scope.row.is_freeze ? '已冻结' : '未冻结'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
              {
                title: '审核通过',
                isDisplay: (auth.isAdmin || auth.MerchantStoreApprove) && !scope.row.is_approve,
                command: () => affirmApprove(scope.row)
              },
              {
                title: '冻结',
                isDisplay: (auth.isAdmin || auth.MerchantStoreFreeze) && !scope.row.is_freeze,
                command: () => affirmStoreFreeze(scope.row)
              },
              {
                title: '解冻',
                isDisplay: (auth.isAdmin || auth.MerchantStoreUnFreeze) && scope.row.is_freeze,
                command: () => affirmStoreUnFreeze(scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.MerchantStoreDelete,
                command: () => deleteStore(scope.row)
              }
            ]"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    components: {
      'my-table-operate': TableOperate,
    },
    mixins: [tableMixin],
    props: {
      dataItemTemp: { type: Object, default: { items: [], num: 0 } }, // 商户列表队列
      page: Number, // 当前查询的页码
      pageSize: Number, // 每页的大小
      deleteStore: Function, // 删除门店 的处理函数
      showDetail: Function, // 商户详情 的处理函数
      affirmStoreFreeze: Function, // 冻结商户 的处理函数
      affirmStoreUnFreeze: Function, // 解冻商户 的处理函数
      offsetHeight: Number // 列表偏置高度
    },

    methods: {

      indexMethod(index) {
        return (this.page - 1) * this.pageSize + index + 1;
      },

      //确认审核
      affirmApprove(item) {
        this.$messageBox.confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let that = this;
          that.storeApprove(item);
        }).catch(() => {
          // console.log('取消');
        });

      },

      //商户审核
      async storeApprove(item) {
        let that = this;
        let {id} = item;
        let res = await Http.post(Config.api.storeApprove, {
          id: id
        });
        if (res.code === 0) {
          this.$message({ message: '商户审核通过！', type: 'success' });
          item.is_approve = true;
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .title:hover {
    font-weight: 600;
  }

</style>
