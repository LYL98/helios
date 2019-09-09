<template>
  <el-dialog :title="`${detail.item_code}/${detail.item_title}`" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel">
    <el-table :data="dataItem.items" width="100%" :height="460" :row-class-name="highlightRowClassName">
      <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
      <el-table-column label="门店名称" prop="store_title"/>
      <el-table-column label="所在县域" width="120" prop="zone_title"/>
      <el-table-column label="参团人数" width="120" prop="user_num"/>
      <el-table-column label="总件数" width="120">
        <template slot-scope="scope">{{scope.row.sale_num}}件</template>
      </el-table-column>
    </el-table>
    <div class="pagination-div" v-if="dataItem.num > 0">
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
  </el-dialog>
</template>

<script>
import detailMixin from './detail.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { ImagePreview } from  '@/common'

export default {
  name: "DetailGroupActivityItem",
  mixins: [detailMixin],
  components: {
    'image-preview': ImagePreview,
  },
  created() {
  },
  data(){
    let initDetail = {
    }
    return {
      groupActivityStatus: Constant.GROUP_ACTIVITY_STATUS,
      query: {
        id: '',
        page: 1,
        page_size: Constant.PAGE_SIZE
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      dataItem: {
        items: []
      },
    }
  },
  methods: {
    //显示新增修改(重写mixin)
    showDetail(data){
      if(data){
        this.$data.query.page = 1;
        this.$data.query.id = data.id;
        this.groupActivityActItemSale();
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取列表
    async groupActivityActItemSale(){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupActivityActItemSale, this.query);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.dataItem = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },

    // 设置每页显示数量
    changePageSize(pageSize) {
      this.$data.query.page_size = pageSize;
      this.$data.query.page = 1;
      this.groupActivityActItemSale();
    },

    //翻页
    changePage(page) {
      this.$data.query.page = page;
      this.groupActivityActItemSale();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./detail.scss";
</style>
