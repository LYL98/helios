<template>
  <sub-menu>
    <template slot="left-query">
      <div class="menu-left-query">
        <div class="left">
          <global-storehouse v-if="query.delivery_date" v-model="query.src_storehouse_id" @initCallBack="initStorehouse" @change="changeQuery"/>
        </div>
        <div class="right">
          <global-delivery-date v-model="query.delivery_date" @change="changeQuery"/>
        </div>
      </div>
    </template>
    <div class="container-table">
      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="list.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="index" width="80" align="center" label="序号" :index="indexMethod"></el-table-column>
          <el-table-column label="商品编号/名称" min-width="3">
            <template slot-scope="scope">{{scope.row.code}}/{{scope.row.title}}</template>
          </el-table-column>
          <el-table-column label="司机" min-width="2">
            <template slot-scope="scope">{{scope.row.driver.realname}} / {{scope.row.driver.phone}}</template>
          </el-table-column>
          <el-table-column label="分配时间" min-width="1">
            <template slot-scope="scope">{{scope.row.minutes}}分钟前</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="table-bottom" v-if="list.items.length > 0">
        <div class="left"></div>
        <div class="right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50]"
            @size-change="changePageSize"
            @current-change="changePage"
            :total="list.num"
            :page-size="query.page_size"
            :current-page="query.page"
          />
        </div>
      </div>
    </div>
  </sub-menu>
</template>

<script>
  import { Row, Col, Table, TableColumn, Pagination } from 'element-ui';
  import { GlobalStorehouse, GlobalDeliveryDate } from '@/component';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'distribute-plan',
    mixins: [mainMixin, tableMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'global-storehouse': GlobalStorehouse,
      'global-delivery-date': GlobalDeliveryDate
    },
    data() {
      return {
        query: {
          delivery_date: '',
          src_storehouse_id: '', //v-model 初始化复值
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        list: {
          items: []
        }
      }
    },
    created() {
      documentTitle('场地 - 调拨装车 - 装车延时');
    },
    methods: {
      // 初始化
      initStorehouse(){
        this.supDistributeAllocateDelaySortQuery();
      },

      changeQuery() {
        this.$data.query.page = 1;
        this.supDistributeAllocateDelaySortQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.supDistributeAllocateDelaySortQuery();
      },

      changePageSize(page_size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = page_size;
        this.supDistributeAllocateDelaySortQuery();
      },

      async supDistributeAllocateDelaySortQuery() {
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supDistributeAllocateDelaySortQuery, this.query);
        this.$loading({isShow: false});
        if (res.code === 0){
          this.$data.list = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .menu-left-query{
    width: 280px;
    display: flex;
    align-items: center;
    >.left{
      margin-right: 10px;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>
