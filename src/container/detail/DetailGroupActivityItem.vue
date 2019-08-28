<template>
  <el-dialog title="0000032/超好吃的水果" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel">
    <el-table :data="dataItem.items" width="100%" :height="460" style="border-top: 1px solid #eee;">
      <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
      <el-table-column label="门店名称" prop="title"/>
      <el-table-column label="所在县域" width="120">
        <template slot-scope="scope">
          123
        </template>
      </el-table-column>
      <el-table-column label="参团人数" width="120">
        <template slot-scope="scope">
          123
        </template>
      </el-table-column>
      <el-table-column label="总件数" width="120">
        <template slot-scope="scope">
          123件
        </template>
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
      images: []
    }
    return {
      groupActivityStatus: Constant.GROUP_ACTIVITY_STATUS,
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
        this.GroupItemDetail(data.id);
        this.$data.detail = this.copyJson(data);
        this.$data.isShow = true;
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取列表
    async GroupItemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupItemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
