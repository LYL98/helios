<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.MerchantRefundLogQuery">
      <div class="left"></div>
      <div class="right">
        <el-button size="mini" type="primary" @click="handleShowDetail('DetailMerchantRefundLog')">退筐变更记录</el-button>
      </div>
    </div>

    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table
        class="list-table my-table-float"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
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
        <el-table-column label="县域" min-width="200" prop="city.title">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city && scope.row.city.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已退筐数" min-width="100" prop="frame_num_real">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.frame_num_real || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="剩余筐数" min-width="100" prop="frame_num">
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
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent="this" />
      </div>
    </div>
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    components: {
    },
    mixins: [tableMixin],
    created() {
      //在Query组件初始化
      //let pc = this.getPageComponents('QueryMerchantRefund');
      //this.getData(pc.query);
    },
    data() {
      return {
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
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
