<template>
  <div>
    <div class="operate" v-if="auth.isAdmin || auth.MerchantRefundLogQuery">
      <el-button size="mini" v-if="auth.isAdmin || auth.MerchantRefundLogQuery" type="primary" @click="handleShowDetail('DetailMerchantRefundLog')">退框变更记录</el-button>
    </div>

    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
        </el-table-column>
        <el-table-column label="门店名称" prop="title" min-width="220">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所在仓" min-width="200" prop="city.title">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city && scope.row.city.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已退框数" min-width="100" prop="frame_num_real">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_num_real || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="剩余框数" min-width="100" prop="frame_num">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_num || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已退金额" min-width="110" prop="frame_amount_real">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_amount_real == 0 ? '' : '￥' }}{{ scope.row.frame_amount_real == 0 ? '-' : returnPrice(scope.row.frame_amount_real) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="剩余金额" min-width="110" prop="frame_amount">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_amount == 0 ? '' : '￥' }}{{ scope.row.frame_amount == 0 ? '-' : returnPrice(scope.row.frame_amount) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.MerchantRefundEdit,
                command: () => handleShowAddEdit('AddEditMerchantRefund', scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页标签 -->
    <div class="footer">
      <div class="table-pagination" v-if="dataItem.num > 0">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    components: {
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.MerchantRefundLogQuery) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
      let pc = this.getPageComponents('QueryMerchantRefund');
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.storeQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
