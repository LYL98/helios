<template>
  <div :style="`margin: 6px; background: white; height: ${viewWindowHeight - 90}px`">
    <div style="padding: 20px;">
      <h6 style="font-size: 14px">商户表</h6>
      <div style="margin-top: 18px; margin-left: 20px">
        <el-button v-if="(auth.isAdmin || auth[item.auth]) && (item.key === '5' || item.key === '7' || item.key === '8')" @click.native="show(index)" v-for="(item, index, key) in titleStrs" :key="key" style="margin-bottom: 10px;margin-left:0; margin-right:10px">
          {{item.title}}
          <i class="el-icon-download" v-if="titleStrs[selectIndex].key !== 'print'"></i>
          <i class="el-icon-printer" v-else></i>
        </el-button>
      </div>
    </div>
    <div style="padding: 20px; margin-top: 15px">
      <h6 style="font-size: 14px">订单表</h6>
      <div style="margin-top: 18px; margin-left: 20px">
        <el-button v-if="(auth.isAdmin || auth[item.auth]) && (item.key === '1' || item.key === '9' || item.key === '10' || item.key === '2')" @click.native="show(index)" v-for="(item, index, key) in titleStrs" :key="key" style="margin-bottom: 10px;margin-left:0; margin-right:10px">
          {{item.title}}
          <i class="el-icon-download" v-if="item.key !== 'print'"></i>
          <i class="el-icon-printer" v-else></i>
        </el-button>
      </div>
    </div>
    <div style="padding: 20px; margin-top: 15px">
      <h6 style="font-size: 14px">打印</h6>
      <div style="margin-top: 18px; margin-left: 20px">
        <el-button v-if="(auth.isAdmin || auth[item.auth]) && item.key === 'print'" @click.native="show(index)" v-for="(item, index, key) in titleStrs" :key="key" style="margin-bottom: 10px;margin-left:0; margin-right:10px">
          {{item.title}}
          <i class="el-icon-download" v-if="item.key !== 'print'"></i>
          <i class="el-icon-printer" v-else></i>
        </el-button>
      </div>
    </div>


    <el-dialog :title="titleStrs[selectIndex].title" :visible="isShow" :before-close="cancel" :width="isPreview ? '1000px' : '540px'">
      <div v-if="isPreview">
        <div style="display: flex; flex-wrap: wrap;">
          <p v-if="titleStrs[selectIndex].key !== '7'"><span style="color: #73767D;">当前省份</span><span style="margin-left: 12px;color: #3B3D42;">{{province.title}}</span></p>
          <p v-if="titleStrs[selectIndex].key !== '7'" style="margin-left: 70px;"><span style="color: #73767D;">日期</span><span style="margin-left: 12px;color: #3B3D42;">{{previewDate()}}</span></p>
          <p v-if="titleStrs[selectIndex].key === '2' || titleStrs[selectIndex].key === 'print'" style="margin-left: 70px;"><span style="color: #73767D;">县市</span><span style="margin-left: 12px;color: #3B3D42;">{{cityName}}</span></p>
        </div>
        <div style="width: 100%; display: flex; justify-content: center; margin-top: 20px">
          <img v-if="titleStrs[selectIndex].key === '1'" src="@/assets/img/export_preview_city.png" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === '2'" src="@/assets/img/export_preview_merchant.png" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === '5'" src="@/assets/img/export_preview_short_list.jpg" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === '7'" src="@/assets/img/export_preview_banlance.jpg" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === '8'" src="@/assets/img/export_preview_balance_log.png" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === '9'" src="@/assets/img/export_preview_route.png" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === '10'" src="@/assets/img/export_preview_store.png" style="width: 800px; height: 450px"/>
          <img v-else-if="titleStrs[selectIndex].key === 'print'" src="@/assets/img/export_preview_print.png" style="width: 800px; height: 450px"/>
        </div>

      </div>
      <el-form label-position="right" label-width="100px" style="width: 540px; margin-top: -10px;" :rules="rules" ref="ruleForm" v-else-if="titleStrs[selectIndex].key !== '7'">
        <el-form-item label="当前省份">
          {{ province.title }}
        </el-form-item>
        <el-form-item  label="选择日期" v-if="titleStrs[selectIndex].key !== '2' && titleStrs[selectIndex].key !== 'print'">
          <el-date-picker
            v-model="pickerValue"
            value-format="yyyy-MM-dd"
            type="daterange"
            :picker-options="fixDateOptions"
            @change="changePicker"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
            <div v-if="titleStrs[selectIndex].key === '1' || titleStrs[selectIndex].key === '5' || titleStrs[selectIndex].key === '9'|| titleStrs[selectIndex].key === '10' " style="color: #7f1305;">注：选择配送日期</div>
            <div v-else-if="titleStrs[selectIndex].key === '6'" style="color: #7f1305;">注：选择售后申请日期</div>
            <div v-else-if="titleStrs[selectIndex].key === '8' " style="color: #7f1305;">注：选择查询日期</div>
            <div v-else style="color: #7f1305;">注：选择下单日期</div>
        </el-form-item>
        <el-form-item label="选择日期" v-else>
          <el-date-picker
            v-model="query.date"
            value-format="yyyy-MM-dd"
            type="date"
            :clearable="false"
            placeholder="选择日期" style="width: 320px;"/>
            <div style="color: #7f1305;">注：选择配送日期</div>
        </el-form-item>
        <el-form-item label="选择县域" v-if="titleStrs[selectIndex].key === '2'">
          <my-select-city :provinceCode="province.code"
                          v-model="query.city_code"
                          :clearable="titleStrs[selectIndex].key === '2'"
                          style="width: 320px;"
                          @changeCityName="onChangeCityName"/>
        </el-form-item>
        <!--打印(暂时)-->
        <template v-if="titleStrs[selectIndex].key === 'print'">
          <el-form-item label="">
            <el-radio label="city" v-model="printType" >以县域维度打印</el-radio>
            <el-radio label="item" v-model="printType">以商品维度打印</el-radio>
          </el-form-item>
          <el-form-item label="选择县域" v-if="printType === 'city'">
            <my-select-city :provinceCode="province.code"
                            v-model="query.city_code"
                            clearable
                            style="width: 320px;"
                            @changeCityName="onChangeCityName"/>
          </el-form-item>
          <el-form-item label="选择商品" v-else>
            <search-item v-model="itemData" style="width: 320px;"/>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="preview" style="float: left" v-if="!isPreview">预 览</el-button>
        <el-button @click.native="preStep" v-if="isPreview">上一步</el-button>
        <el-button @click.native="cancel" v-else>取 消</el-button>
        <el-button type="primary" @click.native="submitExport">{{ titleStrs[selectIndex].key === 'print' ? '打 印' : '导 出' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  Button,
  Dialog,
  DatePicker,
  Select,
  Option,
  Radio
} from 'element-ui';
import { Http, Config, Constant, DataHandle, Request } from "@/util";
import { SelectCity, SelectCityMulti } from "@/common";
import viewMixin from '@/view/view.mixin';
import { SearchItem } from '@/container';

const apis = {
  "1": Config.api.orderCityExport,
  "2": Config.api.orderExport,
  "3": Config.api.orderListExport,
  "4": Config.api.orderItemExport,
  "5": Config.api.orderShortListExport,
  "6": Config.api.orderAftersaleExport,
  "7": Config.api.orderBalanceExport,
  "8": Config.api.orderBalanceLogExport,
  "9": Config.api.orderRouteExport,
  "10": Config.api.orderStoreExport,
  "print": Config.api.orderLabelPrint
};

export default {
  name: "ExportPrint",
  mixins: [viewMixin],
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-dialog": Dialog,
    "el-button": Button,
    "el-date-picker": DatePicker,
    "el-select": Select,
    "el-option": Option,
    "my-select-city": SelectCity,
    'search-item': SearchItem,
    'el-radio': Radio
  },
  created() {
    let that = this;
    documentTitle("统计 - 导出、打印");

   /* //测试打印数据//正式时注释
    let data = [{
        "order_code": "00118101108835",
        "store_title": "测试门店门店",
        "city_title": "测试县",
        "item_code": "160172",
        "item_title": "测试商品",
        "date": "2018-09-29",
        "ad": "我是广告语abdcde",
        "num": 2,
    },{
        "order_code": "00118101108835",
        "store_title": "测试门店门店很长的情况下有两行的情况下",
        "city_title": "测试县",
        "item_code": "160172",
        "item_title": "测试商品",
        "date": "2018-09-29",
        "ad": "我是广告语abdcde",
        "num": 1,
    },{
        "order_code": "00118101108835",
        "store_title": "测试门店门店很长的情况下有两行的情况下",
        "city_title": "测试县",
        "item_code": "160172",
        "item_title": "测试商品门店很长的情况下有两行的情况下",
        "date": "2018-09-29",
        "ad": "我是广告语abdcde",
        "num": 1,
    },{
        "order_code": "00118101108835",
        "store_title": "测试门店门店",
        "city_title": "测试县",
        "item_code": "160172",
        "item_title": "测试商品门店很长的情况下有两行的情况下",
        "date": "2018-09-29",
        "ad": "我是广告语abdcde",
        "num": 1,
    }];
    that.printTemplate(data);*/
  },
  data() {
    let d = DataHandle.returnDateStr();
    let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
    return {
      province: this.$province,
      isShow: false,
      isPreview: false,
      selectIndex: 0,
      titleStrs: [
        {key: '9', title: '线路拣货表', auth: 'OrderRouteExport'},
        {key: '1', title: '县域订货单', auth: 'OrderCityExport'},
        {key: '10', title: '门店分货表', auth: 'OrderStoreExport'},
        {key: '2', title: '客户收货单', auth: 'OrderExport'},
        {key: '5', title: '商品缺货列表', auth: 'OrderShortListExport'},
        // {key: '7', title: '商户余额', auth: 'OrderBalanceExport'},
        // {key: '8', title: '商户余额流水', auth: 'OrderBalanceLogExport'},
        {key: 'print', title: '商品标签', auth: 'OrderLabelPrint'},
      ],
      pickerValue: [nowDate, nowDate],
      cityName: '',
      printType: 'city', //city 县域；item 商品
      itemData: {},
      query: {
        city_code: "",
        date: nowDate,
        begin_date: nowDate,
        end_date: nowDate
      },
      rules: {
        province_code: [
          { required: true, message: "省份信息读取失败！", trigger: "change" }
        ]
      },
      /*最近30天（以当天作为结尾，往前30天）
        本周
        上周
        本月（以本月作为选择）
        上月（以当前所在月的上一个月作为选择）
        本年
        上一年*/
      fixDateOptions: Constant.FIX_DATE_RANGE,
    };
  },
  methods: {
    preview() {
      this.isPreview = true;
    },
    preStep() {
      this.isPreview = false;
    },
    previewDate() {
      let {titleStrs, selectIndex, pickerValue, query} = this;
      if (titleStrs[selectIndex].key !== '2' && titleStrs[selectIndex].key !== 'print') {
        return pickerValue[0] + '至' + pickerValue[1];
      } else {
        return query.date;
      }
    },
    onChangeCityName(cityName) {
      this.cityName = cityName;
      // console.log('city name: ', cityName)
    },
    //显示
    show(index) {
      this.$data.selectIndex = index;
      this.$data.isShow = true;
      // if(type == 7){
      //     this.submitExport();
      // }else{
      //
      // }
    },
    //隐藏
    cancel() {
      this.isPreview = false;
      this.$data.isShow = false;
    },
    //改变日期
    changePicker(value) {
      let { query } = this;
      if (value && value.length === 2) {
        query.begin_date = value[0];
        query.end_date = value[1];
      } else {
        query.end_date = "";
        query.end_date = "";
      }
    },
    //确定
    submitExport() {
      let that = this;
      let { province, query, selectIndex, titleStrs } = that;
      // 拼接省份编码
      let queryStr = apis[titleStrs[selectIndex].key] + "?province_code=" + province.code;
      switch (titleStrs[selectIndex].key) {
        case "1": // 县域订货单导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "2": // 客户收货单导出 params: province_code, [city_codes, item_ids, date]
          queryStr += `&date=${query.date}&city_codes=${query.city_code}`;
          break;
        case "3": // 订单列表导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "4": // 订单商品列表导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "5": // 商品缺货列表导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "6": // 售后单列表导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "7": // 余额导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "8": // 流水导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
        case "9": // 线路 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
        case "10": // 分货 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case "print": // 打印订单。
          this.printOrderTags();
          return;
      }
      window.open(queryStr);
    },
    //打印
    async printOrderTags() {
      let that = this;
      let { query ,province, itemData, printType} = this;
      query.province_code = province.code;
      if (!province.code) {
        this.$message({ title: "提示", message: "省份信息读取失败", type: "error" });
        return false;
      }

      let res = await Http.get(Config.api.orderLabelPrint, {
        ...query,
        sort_by: printType,
        item_id: itemData.id || ''
      });
      if (res.code === 0) {
        that.cancel(); //先隐藏弹层，不然打印会模糊
        setTimeout(()=>{
          that.printTemplate(res.data);
        }, 0);
      } else {
        this.$message({ title: "提示", message: res.message, type: "error" });
      }
    },
    //打印模板
    printTemplate(data) {
      //打印
      const fun = (brandName) =>{
        let tagTemplate = "", dataTemp = [];
        //处理数据
        data.forEach(item => {
          if (item.num === 1) {
            let d = {
              rank: 1,
              ...item
            };
            d.rank = 1;
            dataTemp.push(d);
          } else {
            for (let i = 0; i < item.num; i++) {
              let d = {
                rank: i + 1,
                ...item
              };
              dataTemp.push(d);
            }
          }
        });
        dataTemp.map(item => {
          tagTemplate += `
            <div class="item-div">
              <div class="item">
                <div class="top">
                  ${item.store_title}
                </div>
                <div class="centre">
                  <div class="item-code">
                    ${item.item_code}
                    <span>${item.item_title}</span>
                  </div>
                  <div class="item-ad">${item.ad}</div>
                </div>
                <div class="bottom">
                  <div class="left">
                    <div class="num-rank">${item.rank} / ${item.num}</div>
                  </div>
                  <div class="right">
                    <div class="date" style="color: #000;">
                      <span class="logo">${brandName}</span>${item.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        document.getElementById("app").innerHTML = `
          <div class="order-label-print">
            ${tagTemplate}
          </div>
        `;
        window.onafterprint = function() {
          document.location.reload();
        };
        window.print();
      }
      //获取品牌
      this.$getBrand().then(res => {
        fun(res.brand_name);
      });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.order-label-print {
  color: #000000 !important;
  width: 200px;
  .item-div {
    height: 146px;
    overflow: hidden;
    > .item {
      width: 200px;
      height: 146px;
      position: relative;
      .top {
        height: 26px;
        overflow: hidden;
        line-height: 26px;
        font-size: 20px;
        font-weight: bold;
      }
      .centre {
        .item-code {
          margin-top: 6px;
          font-size: 24px;
          height: 49px;
          line-height: 20px;
          font-weight: bold;
          span{
            font-size: 15px;
          }
        }
        .item-ad {
          height: 26px;
          margin-top: 14px;
          font-size: 20px;
          font-weight: bold;
          font-style: italic;
        }
      }
      .bottom {
        position: absolute;
        width: 200px;
        bottom: 0;
        display: flex;
        align-items: flex-end;
        font-size: 13px;
        line-height: 18px;
        margin-top: 7px;
        .left {
          flex: 1;
          float: left;
          background: #fff;
          /*.num-rank {*/
            /*font-size: 16px;*/
          /*}*/
        }
        .right {
          flex: initial;
          text-align: center;
          background: #fff;
          padding-right: 10px;
          .logo {
            /*font-size: 16px;*/
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
