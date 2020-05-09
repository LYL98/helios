<template>
  <el-dialog title="团长账户余额明细" :visible="isShow" width="1200px" :before-close="handleCancel">
    <el-table :data="balanceList.items" width="100%" :height="460" :row-class-name="highlightRowClassName">
      <el-table-column type="index" :index="indexMethod" width="80" align="center" label="序号"></el-table-column>
      <el-table-column label="时间" prop="created" width="260"/>
      <el-table-column label="原有余额" width="200">
        <template slot-scope="scope">&yen;{{returnPrice(scope.row.old_balance)}}</template>
      </el-table-column>
      <el-table-column label="变动金额" prop="str_obj.acc_amount" width="200">
        <template slot-scope="scope">
          <div class="amount">
            <div class="up" v-if="scope.row.reason === 'gb_profit'">&yen;{{returnPrice(scope.row.amount)}}</div>
            <div class="down" v-else>&yen;{{returnPrice(Math.abs(scope.row.amount))}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="现有余额" width="200">
        <template slot-scope="scope">&yen;{{returnPrice(scope.row.new_balance)}}</template>
      </el-table-column>
      <el-table-column label="变动原因">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.row.reason === 'gb_profit'">团购收益</div>
            <div v-else>余额转账</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-div" v-if="balanceList.num > 0">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="balanceList.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
    </div>
  </el-dialog>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailHeadBalanceLog",
    mixins: [detailMixin],
    components: {
    },
    data() {
      return {
        query: {
          store_id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        balanceList: {
          items: [],
          num: 0
        },
        initDetail: {
        },
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.balanceList = {
          items: [],
          num: 0
        };
        this.$data.query.page = 1;
        if(data){
          this.$data.detail = JSON.parse(JSON.stringify(data));
        }else{
          this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        }
        
        //获取账户列表
        this.$data.query.store_id = data.id;
        this.groupStoreBalanceLog();
      },
      //获取账户列表
      async groupStoreBalanceLog(){
        this.$loading({isShow: true, isWhole: true});
        let { query } = this;
        let res = await Http.get(Config.api.groupStoreBalanceLog, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          let rd = res.data;
          this.$data.balanceList = rd;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        this.$data.query.page_size = pageSize;
        this.$data.query.page = 1;
        this.groupStoreBalanceLog();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.groupStoreBalanceLog();
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
  .amount{
    >.up{
      color: #F8931D;
      &::before{
        content: '+';
      }
    }
    >.down{
        color: #76C627;
        &::before{
          content: '-';
        }
    }
  }
</style>
