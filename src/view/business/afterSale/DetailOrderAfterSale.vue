<template>
  <detail-layout title="售后单详情" :isShow="isShow" direction="ttb" :before-close="cancel" type="drawer">
    <div style="padding: 10px 20px;">
      <div class="after-title">
        <div class="title">
          <span>申请时间：{{detail.created}}</span>
          <span>服务单号：{{detail.code}}</span>
        </div>
        <el-tag size="small" :disable-transitions="true" :type="detail.status === 'close' ? 'info' : 'danger'">
          {{ afterSaleStatus[detail.status] }}
        </el-tag>
      </div>
      <div class="process-result">
        <li class="process-title">
            <span class="item">商户等级：{{ detail.merchant_grade_code || '无' }}</span>
            <span class="item" style="width: 300px;">商户过去7天退赔率：{{detail.aftersale_rate === null ? '-' : (detail.aftersale_rate / 10) + '%'}}</span>
            <span class="item" style="width: 470px;">该商品（同发货日期）所有客户提报次数/销售人次：{{detail.merchant_as_same_item}} 次 / {{detail.distinct_merchant}} 人次</span>
        </li>
        <h6 class="title">处理结果</h6>
        <ul v-if="detail.status === 'close'">
          <li>
            <span class="item">处理类型：{{ afterSaleOptType[detail.opt_type] }}</span>
            <span class="item">
              是否退货：{{detail.if_restore ? '是' : '否'}}
            </span>
            <span class="item" v-if="detail.amount_refund">
              退款金额：<span style="color: #ff3724;">&yen;{{ returnPrice(detail.amount_refund) }}</span>
            </span>
          </li>
          <li>
            <span class="item">处理件数：{{ detail.num }} 件</span>
            <span class="item">
              处理描述：<span style="word-break: break-word;">{{ detail.opt_detail || '无' }}</span>
            </span>
          </li>
        </ul>
        <p style="color: #999;" v-if="judgeOrs(detail.status, ['waiting_dispose', 'handling'])">售后单正在处理中...</p>
        <!--二次处理结果-->
        <template v-if="detail.handle_second_time">
          <h6 class="title" style="margin-top: 16px;">二次处理结果</h6>
          <ul>
            <li>
              <span class="item">
                退款金额：<span style="color: #ff3724;">&yen;{{ returnPrice(detail.handle_second_refund_amount) }}</span>
              </span>
              <span class="item">
                处理描述：<span style="word-break: break-word;">{{ detail.handle_second_remark || '无' }}</span>
              </span>
            </li>
          </ul>
        </template>
      </div>
      <div class="item-detail">
        <h6 class="title">售后商品</h6>
        <el-table :data="tableData" :row-class-name="highlightRowClassName" :highlight-current-row="true">
          <el-table-column label="商品图" width="70">
            <template slot-scope="scope">
              <my-image-preview>
                <img :src="tencentPath + scope.row.item_image + '_min200x200'" style="width: 64px;height: 64px;"/>
              </my-image-preview>
            </template>
          </el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <div style="cursor: pointer; text-decoration: underline;" @click="showItemDetail(scope.row)">{{scope.row.item_code}} / {{scope.row.item_title}}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品参数" min-width="160">
            <template slot-scope="scope">
              <ul class="item-attrs">
                <li v-for="(item, index) in scope.row.item_attrs" :key="index">
                  {{item}}<span v-if="index < (scope.row.item_attrs.length - 1)">、</span>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="单价" min-width="160">
            <template slot-scope="scope">
              <ul>
                <li>
                  &yen;{{returnPrice(scope.row.item_price_sale)}} / 件
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="件数" min-width="160">
            <template slot-scope="scope">
              <ul class="count-weight">
                <li>
                  <p>{{ scope.row.count_pre }}件</p>
                </li>
                <template v-if="scope.row.count_real !== scope.row.count_pre">
                  <li class="line"></li>
                  <li v-if="scope.row.count_real !== scope.row.count_pre || scope.row.weight_real !== scope.row.weight_pre">
                    <p :class="scope.row.count_real > scope.row.count_pre ? 'red' : 'green'">
                      {{ scope.row.count_real }}件
                    </p>
                  </li>
                </template>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="小计" prop="amount_real" min-width="160">
            <!--<template slot-scope="scope">-->
              <!--&yen;{{ returnPrice(scope.row.amount_real) }}-->
            <!--</template>-->
            <template slot-scope="scope">
              <ul class="count-weight">
                <li>&yen;{{ returnPrice(scope.row.amount_pre) }}</li>
                <li class="line" v-if="scope.row.amount_real !== scope.row.amount_pre"></li>
                <li v-if="scope.row.amount_real !== scope.row.amount_pre"
                  :class="scope.row.amount_real > scope.row.amount_pre ? 'red' : 'green'"
                >&yen;{{ returnPrice(scope.row.amount_real) }}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" align="center">
            <template slot-scope="scope">
              <a
                class="operator"
                href="javascript:void(0);"
                @click="orderShowHideDetail(scope.row.order_id)"
                v-if="auth.isAdmin || auth.OrderDetail"
              >
                查看订单
              </a>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!-- 问题描述 -->
      <div class="problem-description">
        <h6 class="title">问题描述</h6>
        <div class="audit-content">
          <div v-for="(item, index) in detail.comment" :key="index" style="width: 100%; overflow:hidden;">
            <div v-if="item.operator_class === 'member'" class="member">
              <div class="avatar">
                <img :src="!item.avatar ? defaultAvatar : (tencentPath + item.avatar + '_min200x200')"/>
                <span>
                  {{item.realname}}<br/>
                  {{item.phone}}
                </span>
              </div>
              <div style="margin-left: 50px; padding: 10px; background: #FAFAFB; border-radius: 2px">
                <p class="content">
                  <font v-if="detail.reason && index === 0" style="margin-left: -8px;">【{{detail.reason}}】</font>
                  <font v-if="index === 0">【{{returnWeight(detail.weight_at_created)}}斤】</font>
                  <br/>
                  {{item.content}}
                </p>
                <p class="images">
                  <my-image-preview v-if="item.images.length > 0">
                    <img v-for="img in item.images" :key="img" onerror="this.style.display='none'" :src="tencentPath + img + '_min200x200'"/>
                  </my-image-preview>
                </p>
                <div v-if="item.media_urls.length > 0">
                  <video v-for="v in item.media_urls" :key="v" :src="tencentPath + v" style="width: 200px; margin-right: 10px;" controls></video>
                </div>
                <span>{{item.created}}</span>
              </div>
            </div>

            <div v-else class="member f-r">
              <div class="online">
                <span class="t-r" style="margin-bottom: 10px; margin-right: 10px;">客服：{{item.employee_no}}</span>
                <img src="@/assets/img/online_avatar.png" alt="avatar" v-if="!item.avatar" width="48" height="48">
                <img v-else :src="tencentPath + item.avatar + '_min200x200'" width="48" height="48" style="border-radius: 50%;"/>
              </div>
              <div style="margin-right: 50px; padding: 10px; background: #FAFAFB; border-radius: 2px">
                <span class="t-r content">{{item.content}}</span>
                <span class="t-r">{{item.created}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="audit-input" v-if="(auth.isAdmin || auth.OrderAfterSaleAppend) && judgeOrs(detail.status, ['waiting_dispose', 'handling'])">
          <el-form label-position="right" :model="editData" :rules="rules" ref="ruleForm">
            <el-form-item label="" prop="content">
              <div style="display: flex; align-items: center;">
                <el-input
                  v-model.trim="editData.content"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  placeholder="请输入要回复的内容..."
                >
                </el-input>
                <el-button style="margin-left: 10px; height: 75px" type="primary" @click.native="submit">回复</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="margin-left: 20px;">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" plain @click.native="handleShowHindeLoading()" v-if="judgeOrs(detail.status, ['waiting_dispose', 'handling']) && (auth.isAdmin || auth.OrderAfterSaleHandleLoading)">处理进度</el-button>
        <el-button type="primary" @click.native="orderShowHideAfterSaleClose()" v-if="judgeOrs(detail.status, ['waiting_dispose', 'handling']) && (auth.isAdmin || auth.OrderAfterSaleUpdate)">处理完成</el-button>
      </div>
    </div>
  </detail-layout>
</template>

<script>
import { ImagePreview } from '@/common';
import { Http, Config, DataHandle, Constant } from '@/util';
import detailMixin from '@/share/mixin/detail.mixin';

export default {
  name: "DetailOrderAfterSale",
  mixins: [detailMixin],
  components: {
    'my-image-preview': ImagePreview
  },
  computed: {
    tableData() {
      return [ this.detail ]
    }
  },
  data(){
    return{
      isShow: false,
      detail: {},
      orderStatus: Constant.ORDER_STATUS,
      priceChange: Constant.PRICE_CHANGE,
      afterSaleStatus: Constant.AFTER_SALE_STATUS(),
      afterSaleStatusType: Constant.AFTER_SALE_STATUS_TYPE,
      afterSaleResult: Constant.AFTER_SALE_RESULT,
      afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE(),
      defaultAvatar: Constant.IMGS.defaultAvatar,
      editData: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '回复内容不能为空', trigger: 'change' },
          { max: 500, message: '回复内容不能500个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'stripe-row';
      } else if (rowIndex % 2 != 0) {
        return 'default-row'
      }
      return '';
    },
    //返回支付类型
    returnPayType(weixin, balance){
      return DataHandle.returnPayType(weixin, balance);
    },
    returnDateFormat(dateStr, format){
      return DataHandle.returnDateFormat(dateStr, format);
    },
    //取消
    cancel(){
      this.editData.content = '';
      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
      this.$attrs.callback();//回调
      this.orderShowHideAfterSaleDetail();
    },
    //提交回复
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.orderAftersaleAppend();
        }
      });
    },
    //提交回复
    async orderAftersaleAppend(){
      let { detail, editData } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.post(Config.api.aftersaleAppend, {
        aftersale_id: detail.id,
        content: editData.content,
        images: []
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.orderAfterSaleDetail(detail.id);
        this.$refs['ruleForm'].resetFields();
        this.$message({title: '提示', message: '售后回复成功', type: 'success'});
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //查看商品详情
    showItemDetail(item) {
      let pc = this.getPageComponents('AddEditItemList');
      pc.showAddEdit({ id: item.item_id }, 'detail');
    },
    //组件回调
    myCallBack(res){
      let { detail } = this;
      this.orderAfterSaleDetail(detail.id);
    },
    //关闭
    orderShowHideAfterSaleClose(){
      let pc = this.getPageComponents('FormOrderAfterSaleClose');
      pc.orderShowHideAfterSaleClose(this.detail);
    },
    //处理理度
    handleShowHindeLoading(){
      let pc = this.getPageComponents('HandleLoading');
      pc.handleShowHindeLoading(this.detail);
    },
    //查看进度
    orderShowHideAfterSaleDetail(aftersale){
      if(aftersale){
        if(this.isShow){
          this.$data.isShow = false;
          this.orderAfterSaleDetail(aftersale.id);
        }else{
          this.orderAfterSaleDetail(aftersale.id);
        }
      }else{
        this.$data.isShow = false;
      }
    },
    //详情
    async orderAfterSaleDetail(id){
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.post(Config.api.afterSaleDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
    },
    //显示订单详情
    orderShowHideDetail(id){
      let pc = this.getPageComponents('OrderDetail');
      pc.orderShowHideDetail(id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .attrs{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    span{
      margin: 3px 0;
      border: 1px solid #999;
      border-radius: 3px;
      padding: 0 3px;
      font-size: 12px;
      margin-right: 5px;
    }
  }
  .after-title{
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > .title{
      flex: 1;
      >span{
        display: inline-block;
        width: 360px;
      }
    }
    > .after-date{
      text-align: right;
      flex: initial !important;
    }
  }

  .process-result {
    padding: 10px 0 10px 10px;
    border-bottom: 1px solid #f3f4f6;
    >.process-title{
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    li, p {
      line-height: 2;
      >.item{
        display: inline-block;
        width: 360px;
      }
    }
  }

  .item-attrs {
    display: flex;
    flex-wrap: wrap;
  }


  h6.title {
    font-size: 14px;
    color: #333333;
    margin: 0 0 10px 0;
  }

  a.operator {
    text-decoration: underline;
  }

  a.operator:hover {
    font-weight: 600;
  }

  .item-detail {
    h6.title {
      padding: 10px 10px 0 10px;
    }
  }

  .problem-description {
    padding: 10px;
  }

  .dialog-footer {
    padding: 0 15px;
  }

  .count-weight {
    display: flex;
    align-items: center;
    /*background: red;*/
    .line {
      padding: 0 10px;
      margin: 0 10px;
      width: 5px;
      height: 1px;
      background: #909399;
    }

    .red {
      color: #ff3724;
    }

    .green {
      color: #00d600;
    }
  }

  .brief{
    border-bottom: 5px solid #f3f4f6;
    > .top{
      padding: 20px 0;
      color: $--color-primary;
      > i{
        margin-right: 5px;
        font-size: 32px;
      }
      > .text1{
        font-size: 30px;
      }
      &.undone{
        color: #999;
      }
    }
    > .item{
      padding: 15px 30px;
      display: flex;
      > div{
        flex: 1;
        color: #999;
        font-size: 26px;
      }
    }
    > .hint{
      color: #999;
      font-size: 26px;
      padding: 20px 0;
      > image{
        width: 32px;
        height: 32px;
        position: relative;
        top: 6px;
        margin-left: 6px;
      }
    }
  }

  .step-title, .audit-title{
    border-bottom: 1px solid #f3f4f6;
    padding: 10px 0;
  }

  .step-ico{
    display: flex;
    align-items: center;
    padding: 0px 30px 0;
    height: 60px;
    > .item{
      width: 180px;
      text-align: center;
      > i{
        margin: 24px auto 0;
        font-size: 24px;
      }
    }
    > .interval{
      flex: 1;
      height: 2px;
      background: $--color-primary;
    }
    > .undone{
      background: #999;
    }
  }
  .step-content{
    display: flex;
    font-size: 14px;
    color: #999;
    padding-bottom: 30px;
    border-bottom: 5px solid #f3f4f6;
    > div{
      flex: 1;
      text-align: center;
      > .title{
        font-size: 14px;
        color: $--color-primary;
      }
      > .undone{
        color: #999;
      }
    }
  }
  .audit-content{
    color: #999;
    padding: 10px 0 20px;
    .member{
      width: 48%;
      margin-bottom: 50px;
      .online{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        span {
          margin-left: 8px;
          padding-top: 10px;
        }
      }
      span{
        display: block;
      }
      .avatar{
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        width: 100%;
        >img{
          width: 48px;
          height: 48px;
          margin-right: 10px;
          border-radius: 50%;
          display: block;
        }
        >span{
          display: block;
          flex: 1;
        }
      }
      .content{
        color: #333;
        margin-bottom: 10px;
      }
      .images{
        margin-bottom: 5px;
        img{
          width: 48px;
          height: 48px;
          margin-right: 5px;
        }
      }
    }
  }
  .audit-input{
    padding-top: 24px;
  }
</style>
