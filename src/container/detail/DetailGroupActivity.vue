<template>
  <el-dialog title="团购详情" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel">
    <div class="item-detail">
      <dl class="detail-item">
        <dt class="label">团购编号/名称</dt>
        <dd class="content">
          {{detail.code}}/{{detail.title}}
          <el-tag type="info" style="float: right;">{{groupActivityStatus[detail.status]}}团购中中</el-tag>
        </dd>
      </dl>
      <el-row :gutter="10">
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">开始时间</dt>
            <dd class="content">2019-08-28 10:10:00</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">结束时间</dt>
            <dd class="content">2019-08-28 10:10:00</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">发货时间</dt>
            <dd class="content">2019-08-28 10:10:00</dd>
          </dl>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">总销量</dt>
            <dd class="content">3000件</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">总销售金额</dt>
            <dd class="content">&yen;3200.52</dd>
          </dl>
        </el-col>
        <el-col :span="8">
          <dl class="detail-item">
            <dt class="label">总参团人数</dt>
            <dd class="content">30002</dd>
          </dl>
        </el-col>
      </el-row>
      <el-table :data="dataItem.items" width="100%" :height="460" style="border-top: 1px solid #eee;">
        <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">{{scope.row.item.code}}/{{scope.row.item.title}}</template>
        </el-table-column>
        <el-table-column label="团长价" width="120">
          <template slot-scope="scope">
            123
          </template>
        </el-table-column>
        <el-table-column label="团长价" width="120">
          <template slot-scope="scope">
            123
          </template>
        </el-table-column>
        <el-table-column label="单人最大购买数" width="120">
          <template slot-scope="scope">
            123件
          </template>
        </el-table-column>
        <el-table-column label="库存" prop="created" width="120"></el-table-column>
        <el-table-column label="销量" prop="created" width="120"></el-table-column>
        <el-table-column label="排序" prop="created" width="120"></el-table-column>
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
    let initDetail = {
      images: []
    }
    return {
      groupActivityStatus: Constant.GROUP_ACTIVITY_STATUS,
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      dataItem: {
        items: []
      }
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
    //获取商品列表
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
</style>
