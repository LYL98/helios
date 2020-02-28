<template>
  <print-layout title="打印分拣码" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <!--批量-->
    <div v-for="(item, index) in dataItem" :key="index" class="line-item">
      <div class="line-top">
        <div class="line-title">{{item.line_code}}/{{item.line_title}}</div>
        <div class="line-num">{{item.num}}件</div>
        <div class="item-code">{{item.item_code}}</div>
      </div>
      <div v-for="(s, i) in item.stores" :key="i">
        <div v-for="n in s.num" :key="n" class="item">
          <div class="indexs">
            {{item.line_index}}-{{item.city_index}}-{{item.store_index}}
          </div>
          <div>
            <div>
              <qr-code :content="qrCodeContent(item)" v-if="isShow" :width="120" :height="120"/>
            </div>
            <div>
              <div style="font-size: 16px;">{{s.store_title}}</div>
              <div>{{item.item_code}}</div>
              <div>{{n + 1}}/{{item.stores.length}} 蒲公英 {{detail.delivery_date}}</div>
            </div>
          </div>
        </div>
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
import { Http, Config } from '@/util';
import { QrCode } from '@/common';

export default {
  name: "PrintOperateSort",
  mixins: [printMixin],
  components: {
    'qr-code': QrCode
  },
  created(){
  },
  data() {
    let initDetail = {
      print_data: {}
    }
    return {
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      dataItem: []
    };
  },
  methods: {
    //显示打印(供外部也调用)
    showPrint(data){
      this.$data.detail = data;
      this.supAllocateDetail();
    },
    //获取明细列表
    async supAllocateDetail(){
      let { detail } = this;
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.supAllocateDetail, {
        item_id: detail.id,
        delivery_date: detail.delivery_date
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        rd = [{
          line_code: '123456',
          line_index: '12',
          line_title: '普哥的线路',
          item_code: '1011223344',
          item_title: '普哥的货',
          city_index: '34',
          store_index: '56',
          city_title: '普哥的县',
          out_stock_id: 12,
          num: 5,
          stores: [{
            store_title: '普哥的店',
            num: 2
          },{
            store_title: '普哥的店2',
            num: 3
          }]
        }];
        this.$data.dataItem = rd;
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
  
  .line-item{
    width: 708px;
    background: #eee;
    >.line-top{
      text-align: center;
      height: 472px;
    }
  }
</style>
