<template>
  <el-dialog title="团购详情" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel">
    <div class="item-detail">
      <dl class="detail-item">
        <dt class="label">团购编号/名称</dt>
        <dd class="content">
          {{detail.detail.tid}}/{{detail.detail.title}}
          <el-tag size="small" :type="statusTagType[detail.detail.progress_status]" disable-transitions style="float: right;">
            {{ progressStatus[detail.detail.progress_status] }}
          </el-tag>
        </dd>
      </dl>
      <el-row :gutter="10">
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">开始时间</dt>
            <dd class="content">{{detail.detail.start_time}}</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">结束时间</dt>
            <dd class="content">{{detail.detail.end_time}}</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">发货时间</dt>
            <dd class="content">{{detail.detail.delivery_date}}</dd>
          </dl>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="detail.detail.progress_status !== 'pre' && detail.detail.progress_status !== 'is_deleted'">
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">总销量</dt>
            <dd class="content">{{detail.detail.sale_num}}件</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">总销售金额</dt>
            <dd class="content">&yen;{{returnPrice(detail.detail.sale_amount)}}</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">总参团人数</dt>
            <dd class="content">{{detail.detail.user_num}}</dd>
          </dl>
        </el-col>
      </el-row>
      <el-table :data="detail.items" width="100%" :height="460" style="border-top: 1px solid #eee;">
        <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">
            <div class="link-item add-dot" @click="handleShowDetail('DetailGroupActivityItem', scope.row)" v-if="auth.isAdmin || auth.GroupActivityDetailItem">
              {{scope.row.item_code}}/{{scope.row.item_title}}
            </div>
            <div class="add-dot" v-else>
              {{scope.row.item_code}}/{{scope.row.item_title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="团长价" width="120">
          <template slot-scope="scope">&yen;{{returnPrice(scope.row.header_price)}}</template>
        </el-table-column>
        <el-table-column label="团购价" width="120">
          <template slot-scope="scope">&yen;{{returnPrice(scope.row.price_sale)}}</template>
        </el-table-column>
        <el-table-column label="单人最大购买数" width="120">
          <template slot-scope="scope">{{scope.row.max_num_pp}}件</template>
        </el-table-column>
        <el-table-column label="库存" prop="stock_num" width="120"></el-table-column>
        <el-table-column label="销量" prop="sale_num" width="120"></el-table-column>
        <el-table-column label="排序" prop="rank" width="120"></el-table-column>
      </el-table>
      <div class="pagination-div" v-if="detail.num > 0">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="detail.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
    </div>
    </div>
  </el-dialog>
</template>

<script>
import detailMixin from './detail.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { ImagePreview } from  '@/common'

export default {
  name: "DetailGroupActivity",
  mixins: [detailMixin],
  components: {
    'image-preview': ImagePreview,
  },
  created() {
  },
  data(){
    let initQuery = {
      id: '',
      page: 1,
      page_size: Constant.PAGE_SIZE,
    }
    let initDetail = {
      detail: {},
      items: [],
      num: 0
    }
    return {
      groupActivityStatus: Constant.GROUP_ACTIVITY_STATUS,
      initQuery: initQuery,
      query: this.copyJson(initQuery),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      progressStatus: Constant.GROUP_ACTIVITY_PROGRESS_STATUS,
      statusTagType: Constant.GROUP_ACTIVITY_PROGRESS_STATUS_TYPE,
    }
  },
  methods: {
    //显示新增修改(重写mixin)
    showDetail(data){
      if(data){
        this.$data.query.id = data.id;
        this.GroupActivityDetail();
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取团购详情列表
    async GroupActivityDetail(){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupActivityDetail, this.query);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    // 设置每页显示数量
    changePageSize(pageSize) {
      this.$data.query.page_size = pageSize;
      this.$data.query.page = 1;
      this.GroupActivityDetail();
    },

    //翻页
    changePage(page) {
      this.$data.query.page = page;
      this.GroupActivityDetail();
    },

    //显示商品团购详情
    handleShowDetail(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showDetail(data);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./detail.scss";
  .item-detail {
    .subtitle{
      color: #5A5D64;
      font-size: 14px;
    }
    .detail-item {
      display: flex;
      >.label {
        color: #606266;
        width: 100px;
        line-height: 20px;
        text-align: right;
        margin-right: 10px;
        height: 50px;
      }
      >.content {
        padding-right: 20px;
        flex: 1;
        word-break: break-all;
        line-height: 20px;
      }
    }
  }
  .link-item{
    text-decoration: underline;
    cursor: pointer;
  }
</style>
