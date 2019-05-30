<template>
  <div>
    <el-dialog title="售后单详情" :visible.sync="isShow" v-if="isShow" width="1200px" :before-close="cancel" append-to-body>
      <div class="after-title">
        <div>
          <span>申请时间：{{detail.created}}</span>
          <span style="margin-left: 140px;">服务单号：{{detail.code}}</span>
        </div>
        <el-tag size="small" :disable-transitions="true" :type="detail.status === 'close' ? 'info' : 'danger'">
          {{ afterSaleStatus[detail.status] }}
        </el-tag>
      </div>
      <div class="process-result">
        <li class="process-title">
            <span class="item">商户等级：{{ detail.merchant_grade_code || '无' }}</span>
            <span class="item">商户过去7天退赔率：{{detail.aftersale_rate === null ? '-' : (detail.aftersale_rate / 10) + '%'}}</span>
            <span class="item">该商品（同发货日期）所有客户提报次数：{{detail.merchant_as_same_item}} 次</span>
        </li>
        <h6 class="title">处理结果</h6>
        <ul v-if="detail.status === 'close'">
          <li>
            <span class="item">处理类型：{{ afterSaleOptType[detail.opt_type] }}</span>
            <span class="item" v-if="detail.amount_refund">
              退款金额：<span style="color: #ff3724;">&yen;{{ returnPrice(detail.amount_refund) }}</span>
            </span>
            <span class="item">处理件数：{{ detail.num }} 件</span>
          </li>
          <li>处理描述：<span style="word-break: break-word;">{{ detail.opt_detail || '无' }}</span></li>
        </ul>
        <p style="color: #999;" v-if="detail.status === 'waiting_dispose'">售后单正在处理中...</p>
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
              <div>{{scope.row.item_code}} / {{scope.row.item_title}}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品参数" width="200">
            <template slot-scope="scope">
              <ul class="item-attrs">
                <li v-for="(item, index) in scope.row.item_attrs" :key="index">
                  {{item}}<span v-if="index < (scope.row.item_attrs.length - 1)">、</span>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="180">
            <template slot-scope="scope">
              <ul v-if="scope.row.item_price_sale_piece <= scope.row.item_price_discount">
                <li>
                  &yen;{{returnPrice(scope.row.item_price_sale_piece)}} / 件<span v-if="scope.row.frame_code !== ''">(含框)</span>
                </li>
              </ul>
              <ul v-else>
                <li style="text-decoration: line-through;">
                  &yen;{{returnPrice(scope.row.item_price_sale_piece)}} / 件<span v-if="scope.row.frame_code !== ''">(含框)</span>
                </li>
                <li>
                  &yen;{{returnPrice(scope.row.item_price_discount)}} / 件<span v-if="scope.row.frame_code !== ''">(含框)</span>
                </li>
                <li>
                  (单品满折活动)
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="件数/重量" width="200">
            <!--<template slot-scope="scope">-->
              <!--<ul>-->
                <!--<li v-if="scope.row.count_real">{{ scope.row.count_real }}件</li>-->
                <!--<li v-if="scope.row.weight_real">{{ returnWeight(scope.row.weight_real) }}斤</li>-->
              <!--</ul>-->
            <!--</template>-->
            <template slot-scope="scope">
              <ul class="count-weight">
                <li>
                  <p>{{ scope.row.count_pre }}件</p>
                  <p>{{ returnWeight(scope.row.weight_pre) }}斤</p>
                </li>
                <li class="line" v-if="scope.row.count_real !== scope.row.count_pre || scope.row.weight_real !== scope.row.weight_pre"></li>
                <li v-if="scope.row.count_real !== scope.row.count_pre || scope.row.weight_real !== scope.row.weight_pre">
                  <p
                    v-if="scope.row.count_real !== scope.row.count_pre"
                    :class="scope.row.count_real > scope.row.count_pre ? 'red' : 'green'"
                  >
                    {{ scope.row.count_real }}件
                  </p>
                  <p v-else>
                    {{ scope.row.count_real }}件
                  </p>
                  <p
                    v-if="scope.row.weight_real !== scope.row.weight_pre"
                    :class="scope.row.weight_real > scope.row.weight_pre ? 'red' : 'green'"
                  >
                    {{ returnWeight(scope.row.weight_real) }}斤
                  </p>
                  <p v-else>
                    {{ returnWeight(scope.row.weight_real) }}斤
                  </p>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="小计" prop="amount_real" width="200">
            <!--<template slot-scope="scope">-->
              <!--&yen;{{ returnPrice(scope.row.amount_real) }}-->
            <!--</template>-->
            <template slot-scope="scope">
              <ul class="count-weight">
                <li>&yen;{{ returnPrice(scope.row.amount_pre) }}</li>
                <li class="line" v-if="scope.row.amount_real !== scope.row.amount_pre"></li>
                <li
                  v-if="scope.row.amount_real !== scope.row.amount_pre"
                  :class="scope.row.amount_real > scope.row.amount_pre ? 'red' : 'green'"
                >&yen;{{ returnPrice(scope.row.amount_real) }}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <a
                class="operator"
                href="javascript:void(0);"
                @click="orderShowHideDetail({ isShow: true, data: { id: scope.row.order_id } })"
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
                <font>
                  {{item.realname}}<br/>
                  {{item.phone}}
                </font>
              </div>
              <div style="margin-left: 50px; padding: 10px; background: #FAFAFB; border-radius: 2px">
                <p class="content"><font v-if="detail.reason && index === 0">【{{detail.reason}}】</font>{{item.content}}</p>
                <p class="images">
                  <my-image-preview v-if="item.images.length > 0">
                    <img v-for="img in item.images" onerror="this.style.display='none'" :src="tencentPath + img + '_min200x200'"/>
                  </my-image-preview>
                </p>
                <span>{{item.created}}</span>
              </div>
            </div>

            <div v-else class="member f-r">
              <div class="online">
                <span class="t-r" style="margin-bottom: 10px; margin-right: 10px;">客服：{{item.employee_no}}</span>
                <img src="../../assets/img/online_avatar.png" alt="avatar" v-if="!item.avatar" width="48" height="48">
                <img v-else :src="tencentPath + item.avatar + '_min200x200'" width="48" height="48" style="border-radius: 50%;"/>
              </div>
              <div style="margin-right: 50px; padding: 10px; background: #FAFAFB; border-radius: 2px">
                <span class="t-r content">{{item.content}}</span>
                <span class="t-r">{{item.created}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="audit-input" v-if="(auth.isAdmin || auth.OrderAfterSaleAppend) && detail.status === 'waiting_dispose' ">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">关闭</el-button>
        <el-button type="primary" @click.native="orderShowHideAfterSaleClose({
          data: detail,
          isShow: true
        })" v-if="detail.status === 'waiting_dispose' && (auth.isAdmin || auth.OrderAfterSaleUpdate)">处理完成</el-button>
      </span>
    </el-dialog>
    <after-sale-close :callback="myCallBack" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Form, FormItem, Table, TableColumn, Tag, Button, Select, Option, Input, Dialog, Popover } from "element-ui";
import { ImagePreview } from '@/common';
import { Config, DataHandle, Constant } from '@/util';
import AfterSaleClose from './AfterSaleClose';

export default {
  name: "AfterSaleDetail",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-tag': Tag,
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'el-dialog': Dialog,
    'el-popover': Popover,
    'my-image-preview': ImagePreview,
    'after-sale-close': AfterSaleClose
  },
  computed: {
    ...mapGetters({
      auth: 'globalAuth',
      windowWidth: 'windowWidth',
      windowHeight: 'windowHeight',
      isShow: 'orderIsShowAfterSaleDetail',
      detail: 'orderAfterSaleDetail'
    }),
    stepActive() {
      let {detail} = this;
      switch(detail.status) {
        case 'waiting_dispose': return 2;
        case 'close': return 3;
        default: return 1;
      }
    },
    tableData() {
      return [ this.detail ]
    }
  },
  data(){
    return{
      tencentPath: Config.tencentPath,
      orderStatus: Constant.ORDER_STATUS,
      priceChange: Constant.PRICE_CHANGE,
      afterSaleStatus: Constant.AFTER_SALE_STATUS,
      afterSaleResult: Constant.AFTER_SALE_RESULT,
      afterSaleOptType: Constant.AFTER_SALE_OPT_TYPE,
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
    returnWeight(value) {
      return DataHandle.returnWeight(value);
    },
    //返回金额
    returnPrice(price){
      return DataHandle.returnPrice(price);
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
      this.orderShowHideAfterSaleDetail({ isShow: false });
    },
    //提交回复
    submit(){
      let that = this;
      let { detail, editData } = that;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          that.orderAftersaleAppend({
            data: {
              aftersale_id: detail.id,
              content: editData.content,
              images: []
            },
            callback(){
              that.orderAfterSaleDetail(detail.id);
              that.$refs['ruleForm'].resetFields();
            }
          });
        }
      });
    },
    //组件回调
    myCallBack(res){
      let { detail } = this;
      this.orderAfterSaleDetail(detail.id);
    },
    ...mapActions(['orderShowHideAfterSaleDetail', 'orderAfterSaleDetail', 'orderAftersaleAppend', 'orderShowHideAfterSaleClose', 'orderShowHideDetail'])
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
    > div{
      flex: 1;
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
        img{
          width: 48px;
          height: 48px;
          margin-right: 10px;
          border-radius: 50%;
          float: left;
        }
        font{
          float: left;
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
