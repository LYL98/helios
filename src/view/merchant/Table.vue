<template>
  <div @mousemove="handleTableMouseMove">
    <el-table
      class="list-table"
      :data="dataItem.items"
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
      <!--<el-table-column label="团购门店" min-width="80">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag disable-transitions :type="scope.row.gb_included ? 'regular' : 'info'" size="small"-->
          <!--&gt;{{scope.row.gb_included ? '是' : '否'}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="商户等级" min-width="80">-->
      <!--<template slot-scope="scope">-->
      <!--<div>{{ scope.row.merchant.grade }}</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="所在仓" min-width="80" prop="city.title">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.city && scope.row.city.title }}
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column label="收货地址" min-width="120">-->
      <!--<template slot-scope="scope">-->
      <!--<div :class="isEllipsis(scope.row)">{{ scope.row.address }}</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
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
  import {mapGetters} from 'vuex';
  import {Table, TableColumn, Button, Tag, MessageBox, Message} from 'element-ui';
  import {TableOperate} from '@/common';
  import {Merchant} from '@/service';
  import {DataHandle} from '@/util';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-tag': Tag,
      'my-table-operate': TableOperate,
    },
    mixins: [tableMixin, viewMixin],
    props: {
      dataItem: Object, // 商户列表队列
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
        MessageBox.confirm('确认通过审核?', '提示', {
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
        let res = await Merchant.storeApprove({
          id: id
        });
        if (res.code === 0) {
          Message.success('商户审核通过！');
          item.is_approve = true;
        } else {
          Message.warning(res.message);
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
