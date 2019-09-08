<template>
  <el-dialog title="门店订单详情" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel">
      <div class="item-detail">
          <el-form class="custom-form-detail" label-position="right" label-width="100px" style="width: 1140px;">
            <el-row :gutter="10">
              <el-col :span="16">
                <dl class="detail-item">
                  <dt class="label">团购编号/名称</dt>
                  <dd class="content">{{detail.activity.tid}}/{{detail.activity.title}}</dd>
                </dl>
              </el-col>
              <el-col :span="6">
                <dl class="detail-item">
                  <dt class="label">发货日期</dt>
                  <dd class="content">{{detail.activity.delivery_date}}</dd>
                </dl>
              </el-col>
              <el-col :span="2">
                <dl class="detail-item">
                  <dt class="label"></dt>
                  <dd class="content">
                    <el-tag size="small" :type="groupStoreOrderStatusType[detail.status]" disable-transitions>
                      {{ groupStoreOrderStatus[detail.status] }}
                    </el-tag>
                  </dd>
                </dl>
              </el-col>
            </el-row>

            <h6 class="subtitle" style="padding-bottom: 16px">门店信息</h6>
            <el-row :gutter="10" style="margin-top: 20px;">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">门店名称</dt>
                  <dd class="content">{{detail.store.title}}</dd>
                </dl>
              </el-col>
              <el-col :span="16">
                <dl class="detail-item">
                  <dt class="label">门店地址</dt>
                  <dd class="content">{{detail.store.address}}</dd>
                </dl>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">联系方式</dt>
                  <dd class="content">{{detail.store.linkman}} {{detail.store.phone}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">所在仓</dt>
                  <dd class="content">{{detail.city.title}}</dd>
                </dl>
              </el-col>
              <el-col :span="8">
                <dl class="detail-item">
                  <dt class="label">实际金额</dt>
                  <dd class="content">&yen;{{returnPrice(detail.amoun)}}</dd>
                </dl>
              </el-col>
            </el-row>

            <el-table :data="detail.order_items" width="100%" style="margin-bottom: 20px;">
              <el-table-column type="index" width="80" label="序号"></el-table-column>
              <el-table-column label="商品编号/名称">
                <template slot-scope="scope">{{scope.row.item_code}}/{{scope.row.item_title}}</template>
              </el-table-column>
              <el-table-column label="团购价" width="120">
                <template slot-scope="scope">&yen;{{returnPrice(scope.row.item_price_sale)}}</template>
              </el-table-column>
              <el-table-column label="数量" width="120">
                <template slot-scope="scope">{{scope.row.num}}件</template>
              </el-table-column>
              <el-table-column label="小计" width="120">
                <template slot-scope="scope">&yen;{{returnPrice(scope.row.item_sale_amout)}}</template>
              </el-table-column>
            </el-table>

            <h6 class="subtitle" style="padding-bottom: 16px">订单日志</h6>
            <el-row :gutter="10">
              <div class="action-log" v-if="detail.logs.length > 0">
                <ul v-for="(item, index) in detail.logs" :key="index">
                  <li>
                    <span>{{orderActionLog[item.action]}}</span>
                    <span class="line" v-if="index < detail.logs.length - 1"></span>
                    <span class="remark" v-if="item.remark">({{ item.remark }})</span>
                  </li>
                  <li class="timestamp">{{item.created}}</li>
                </ul>
              </div>
              <div class="load-none" style="margin:36px 0; font-size: 12px;" v-else>暂无订单日志</div>
            </el-row>
          </el-form>
        </div>
    </el-dialog>
</template>

<script>
import detailMixin from './detail.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';

export default {
  name: "DetailGroupStoreOrder",
  mixins: [detailMixin],
  components: {
  },
  created() {
  },
  data(){
    let initDetail = {
      activity: {},
      order_items: [],
      store: {},
      city: {},
      logs: []
    }
    return {
      orderActionLog: {
        create: '订单创建',
        delivery: '订单发货',
        pick: '订单完成(团长确认收货)'
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      groupStoreOrderStatus: Constant.GROUP_STORE_ORDER_STATUS,
      groupStoreOrderStatusType: Constant.GROUP_STORE_ORDER_STATUS_TYPE,
    }
  },
  methods: {
    //显示新增修改(重写mixin)
    showDetail(data){
      if(data){
        this.groupStoreOrderDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async groupStoreOrderDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupStoreOrderDetail, { id: id });
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
    padding-left: 10px;
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
        height: 50px
      }
      >.content {
        padding-right: 20px;
        flex: 1;
        word-break: break-all;
        line-height: 20px;
      }
    }

    .img-div{
      overflow: hidden;
      background: #fff;
      >img{
        width: 64px;
        height: 64px;
        margin-right: 10px;
      }
    }
    .my-quill-editor-detail img {
      width: 480px;
      height: auto;
    }
  }

  .action-log {
    padding: 10px;
    display: flex;
    font-size: 12px;
    > ul {
      width: 252px;

      li {
        line-height: 2;
      }

      li.timestamp {
        color: #909399;
      }

      span.line {
        display: inline-block;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAACCAYAAAAw9X6zAAAAAXNSR0IArs4c6QAAACNJREFUGBljfPr06X8GGgApKSmwqc+ePUMxnZA4E4rqQcABAJDQCgDpcontAAAAAElFTkSuQmCC);
        background-repeat: repeat-x;
        width: 136px;
        height: 1px;
        margin-left: 25px;
        margin-bottom: 4px;
      }
    }
  }
</style>
