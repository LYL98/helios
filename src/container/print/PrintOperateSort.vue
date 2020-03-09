<template>
  <print-layout title="打印商品标签码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div v-for="(ditem, index) in dataItem" :key="index">
      <!--批量-->
      <div v-for="(item, ii) in ditem.items" :key="ii" class="line-item">
        <div class="line-top">
          <div class="line-title">{{prefixInteger(item.line_index, 2)}}/{{item.line_title}}</div>
          <div class="line-num">{{item.num}}件</div>
          <div class="item-code">{{ditem.item_code}}</div>
        </div>
        <div v-for="(s, i) in item.stores" :key="i" class="item-body">
          <div v-for="n in Number(s.num)" :key="n" class="item">
            <div class="indexs">
              {{prefixInteger(item.line_index, 2)}}-{{prefixInteger(s.city_index, 2)}}-{{prefixInteger(s.store_index, 2)}}
            </div>
            <div class="content">
              <div class="left">
                <div>
                  <div class="store-title">{{s.store.title}}</div>
                  <div class="item-code">
                    {{ditem.item_code}}
                    <span class="item-title">/{{ditem.item_title}}</span>
                  </div>
                </div>
                <div class="page-date">
                  <div class="page">{{n}}/{{s.num}}</div>
                  <div class="date">蒲公英{{(detail.delivery_date || '').slice(5, 10)}}</div>
                </div>
              </div>
              <div class="right">
                <qr-code :content="qrCodeContent(ditem)" v-if="isShow" :width="76" :height="76"/>
              </div>
            </div>
          </div>
        </div>
        <div style="page-break-after: always;" v-if="index < dataItem.length - 1"></div>
      </div>
    </div>

    <div class="bottom-btn-body">
      <div class="bottom-btn">
        <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        <el-button size="medium" type="primary" @click.native="handlePrint">打 印</el-button>
      </div>
    </div>
  </print-layout>
</template>

<script>
import printMixin from './print.mixin';
import { Http, Config, DataHandle } from '@/util';
import { QrCode } from '@/common';

export default {
  name: "PrintOperateSort",
  mixins: [printMixin],
  components: {
    'qr-code': QrCode
  },
  created(){
  },
  mounted() {
    this.link = document.createElement('link');
    this.link.rel = 'stylesheet';
    this.link.href = './size-60-40.css';
    let head = document.getElementsByTagName('head')[0];
    head && head.appendChild(this.link);
  },
  beforeDestroy() {
    if (this.link) {
      let head = document.getElementsByTagName('head')[0];
      head && head.removeChild(this.link);
    }
  },
  data() {
    let initDetail = {}
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      dataItem: []
    };
  },
  methods: {
    //处理数据
    prefixInteger(d, n){
      return DataHandle.prefixInteger(d, n);
    },
    //显示打印(供外部也调用)
    showPrint(data){
      this.$data.detail = data;
      this.supAllocateDetailPrint();
    },
    //获取打印列表
    async supAllocateDetailPrint(ids){
      let { detail } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.supAllocateDetailPrint, {
        out_stock_ids: detail.ids.join()
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.dataItem = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    qrCodeContent(item){
      return `{"type":"sort","out_stock_id":${item.id}}`;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './print.scss';

  $multiple: 0.30;

  .line-item{
    width: 750 * $multiple + px;
    font-weight: bold;
    >.line-top{
      width: 750 * $multiple + px;
      height: 500 * $multiple + px;
      font-size: 100 * $multiple + px;
      line-height: 100 * $multiple + px;
      text-align: center;
      >.line-title, >.line-num{
        margin-bottom: 24 * $multiple + px;
        &.line-title{
          padding-top: 36 * $multiple + px;
        }
      }
    }
    >.item-body{
      >.item{
        width: 750 * $multiple + px;
        height: 500 * $multiple + px;
        >.indexs{
          font-size: 130 * $multiple + px;
          line-height: 130 * $multiple + px;
          text-align: center;
          margin-bottom: 24 * $multiple + px;
          padding-top: 20 * $multiple + px;
        }
        >.content{
          display: flex;
          align-items: center;
          margin: 0 25 * $multiple + px;
          >.left{
            height: 250 * $multiple + px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .store-title{
              font-size: 40 * $multiple + px;
              line-height: 50 * $multiple + px;
              height:  50 * $multiple + px;
              margin-bottom: 14 * $multiple + px;
              font-weight: bold;
            }
            .item-code{
              font-size: 50 * $multiple + px;
              line-height: 50 * $multiple + px;
              margin-bottom: 10 * $multiple + px;
              font-weight: bold;
            }
            .item-title {
              font-size: 32 * $multiple + px;
              line-height: 36 * $multiple + px;
            }
            .page-date{
              display: flex;
              align-items: center;
              font-size: 24 * $multiple + px;
              line-height: 24 * $multiple + px;
              >.page{
                flex: 1
              }
            }
          }
          >.right{
            width: 260 * $multiple + px;
            margin-left: 30 * $multiple + px;
          }
        }
      }
    }
  }
</style>
