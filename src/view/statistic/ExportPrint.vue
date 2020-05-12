<template>
  <sub-menu>
    <!-- 查询 -->
    <div class="container-query" style="margin-bottom: 16px;">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province type="select" isRequired @change="selectProvince" />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div style="background: #fff;">
      <div style="padding: 20px;">
        <h6 style="font-size: 14px">商品表</h6>
        <div style="margin-top: 18px; margin-left: 20px">
          <template v-for="(item, index, key) in titleStrs">
            <el-button v-if="(auth.isAdmin || auth[item.auth]) && (item.key === 'orderShortListExport' || item.key === '7' || item.key === '8')" @click.native="show(index)" :key="key" style="margin-bottom: 10px;margin-left:0; margin-right:10px">
              {{item.title}}
              <i class="el-icon-download"></i>
            </el-button>
          </template>
        </div>
      </div>
      <div style="padding: 20px; margin-top: 15px">
        <h6 style="font-size: 14px">订单表</h6>
        <div style="margin-top: 18px; margin-left: 20px">
          <template v-for="(item, index, key) in titleStrs">
            <el-button v-if="(auth.isAdmin || auth[item.auth]) && (item.key === 'orderCityExport' || item.key === 'orderRouteExport' || item.key === 'orderStoreExport' || item.key === 'orderExport')" @click.native="show(index)" :key="key" style="margin-bottom: 10px;margin-left:0; margin-right:10px">
              {{item.title}}
              <i class="el-icon-download"></i>
            </el-button>
          </template>
        </div>
      </div>
      <div style="padding: 20px; margin-top: 15px">
        <h6 style="font-size: 14px">门店销售表</h6>
        <div style="margin-top: 18px; margin-left: 20px">
          <template v-for="(item, index, key) in titleStrs">
            <el-button v-if="(auth.isAdmin || auth[item.auth]) && (item.key === 'storeMExport')" @click.native="show(index)" :key="key" style="margin-bottom: 10px;margin-left:0; margin-right:10px">
              {{item.title}}
              <i class="el-icon-download"></i>
            </el-button>
          </template>
        </div>
      </div>

      <el-dialog :title="titleStrs[selectIndex].title" :visible="isShow" :before-close="cancel" :width="isPreview ? '1000px' : '540px'">
        <div v-if="isPreview">
          <div style="display: flex; flex-wrap: wrap;">
            <p v-if="titleStrs[selectIndex].key !== '7'"><span style="color: #73767D;">当前区域</span><span style="margin-left: 12px;color: #3B3D42;">{{province.title}}</span></p>
            <p v-if="titleStrs[selectIndex].key !== '7'" style="margin-left: 70px;"><span style="color: #73767D;">日期</span><span style="margin-left: 12px;color: #3B3D42;">{{previewDate()}}</span></p>
            <p v-if="titleStrs[selectIndex].key === 'orderExport'" style="margin-left: 70px;"><span style="color: #73767D;">县市</span><span style="margin-left: 12px;color: #3B3D42;">{{cityName}}</span></p>
          </div>
          <div style="width: 100%; display: flex; justify-content: center; margin-top: 20px">
            <img v-if="titleStrs[selectIndex].key === 'orderCityExport'" src="@/assets/img/export_preview_city.png" style="width: 800px; height: 450px"/>
            <img v-else-if="titleStrs[selectIndex].key === 'orderExport'" src="@/assets/img/export_preview_merchant.png" style="width: 800px; height: 450px"/>
            <img v-else-if="titleStrs[selectIndex].key === 'orderShortListExport'" src="@/assets/img/export_preview_short_list.jpg" style="width: 800px; height: 450px"/>
            <img v-else-if="titleStrs[selectIndex].key === 'orderRouteExport'" src="@/assets/img/export_preview_route.png" style="width: 800px; height: 450px"/>
            <img v-else-if="titleStrs[selectIndex].key === 'orderStoreExport'" src="@/assets/img/export_preview_store.png" style="width: 800px; height: 450px"/>
            <img v-else-if="titleStrs[selectIndex].key === 'storeMExport'" src="@/assets/img/export_preview_store.png" style="width: 800px; height: 450px"/>
          </div>

        </div>
        <el-form label-position="right" label-width="100px" style="width: 540px; margin-top: -10px;" :rules="rules" ref="ruleForm" v-else-if="titleStrs[selectIndex].key !== '7'">
          <el-form-item label="当前区域">
            {{ province.title }}
          </el-form-item>
          <el-form-item  label="选择日期" v-if="titleStrs[selectIndex].key !== 'orderExport'">
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
              <div v-if="titleStrs[selectIndex].key === 'orderCityExport' || titleStrs[selectIndex].key === 'orderShortListExport' || titleStrs[selectIndex].key === 'orderRouteExport'|| titleStrs[selectIndex].key === 'orderStoreExport' " style="color: #7f1305;">注：选择配送日期</div>
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
          <el-form-item label="选择县域" v-if="titleStrs[selectIndex].key === 'orderExport'">
            <my-select-city :provinceCode="province.code"
                            v-model="query.city_id"
                            :clearable="titleStrs[selectIndex].key === 'orderExport'"
                            style="width: 320px;"
                            @changeCityName="onChangeCityName"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click.native="preview" style="float: left" v-if="!isPreview">预 览</el-button>
          <el-button @click.native="preStep" v-if="isPreview">上一步</el-button>
          <el-button @click.native="cancel" v-else>取 消</el-button>
          <el-button type="primary" @click.native="submitExport">导 出</el-button>
        </span>
      </el-dialog>
    </div>
  </sub-menu>
</template>

<script>
import { Row, Col, Form, FormItem, Button, Dialog, DatePicker } from 'element-ui';
import { Http, Config, Constant, DataHandle, Request } from "@/util";
import { QueryItem, SelectCity, SelectCityMulti } from "@/common";
import mainMixin from '@/share/mixin/main.mixin';
import { SearchItem, GlobalProvince } from '@/component';

export default {
  name: "ExportPrint",
  mixins: [mainMixin],
  components: {
    'el-row': Row,
    'el-col': Col,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-dialog": Dialog,
    "el-button": Button,
    "el-date-picker": DatePicker,
    "my-select-city": SelectCity,
    'search-item': SearchItem,
    'global-province': GlobalProvince,
    'my-query-item': QueryItem,
  },
  created() {
    let that = this;
    documentTitle("统计 - 导出");
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
        //key 也是api
        { key: 'orderRouteExport', title: '线路拣货表', auth: 'OrderRouteExport' },
        { key: 'orderCityExport', title: '县域订货单', auth: 'OrderCityExport' },
        { key: 'orderStoreExport', title: '门店分货表', auth: 'OrderStoreExport' },
        { key: 'orderExport', title: '客户收货单', auth: 'OrderExport' },
        { key: 'orderShortListExport', title: '商品缺货列表', auth: 'OrderShortListExport' },
        { key: 'storeMExport', title: '门店销售表', auth: 'StoreMExport' }
      ],
      pickerValue: [nowDate, nowDate],
      cityName: '',
      itemData: {},
      query: {
        city_id: "",
        date: nowDate,
        begin_date: nowDate,
        end_date: nowDate
      },
      rules: {
        province_code: [
          { required: true, message: "区域信息读取失败！", trigger: "change" }
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
    //选择区域后【页面初始化】
    selectProvince(data){
      this.$data.query.province = data;
    },
    preview() {
      this.isPreview = true;
    },
    preStep() {
      this.isPreview = false;
    },
    previewDate() {
      let {titleStrs, selectIndex, pickerValue, query} = this;
      if (titleStrs[selectIndex].key !== 'orderExport') {
        return pickerValue[0] + '至' + pickerValue[1];
      } else {
        return query.date;
      }
    },
    onChangeCityName(cityName) {
      this.cityName = cityName;
    },
    //显示
    show(index) {
      this.$data.selectIndex = index;
      this.$data.isShow = true;
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
      // 拼接区域编码
      let queryStr = Config.api[titleStrs[selectIndex].key] + "?province_code=" + province.code;
      switch (titleStrs[selectIndex].key) {
        case 'orderCityExport': // 县域订货单导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case 'orderExport': // 客户收货单导出 params: province_code, [city_ids, item_ids, date]
          queryStr += `&date=${query.date}&city_ids=${query.city_id}`;
          break;
        case 'orderShortListExport': // 商品缺货列表导出 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case 'orderRouteExport': // 线路 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case 'orderStoreExport': // 分货 params: province_code, begin_date, end_date
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
        case 'storeMExport':
          queryStr += `&begin_date=${query.begin_date}&end_date=${query.end_date}`;
          break;
      }
      window.open(queryStr);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
