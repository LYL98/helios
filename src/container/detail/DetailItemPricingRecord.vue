<template>
  <el-dialog title="报价记录" :visible="isShow" width="1200px" :before-close="handleCancel">
    <div class="query">
      <span class="label">时间</span>
      <span>
        <el-date-picker
          size="small"
          v-model="query.pickerValue"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          unlink-panels
          :picker-options="fixDateOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changePicker"
          class="query-item-date"
          style="width: 200px;"
        />
      </span>
      <span class="label">展示分类</span>
      <span><select-display-class v-model="query.display_class_code" @change="itemPricingRecord" clearable style="width: 200px;" size="small"/></span>
      <span class="label">搜索</span>
      <span>
        <el-input aria-placeholder="商品编号/名称" v-model="query.condition" @keyup.enter.native="itemPricingRecord" style="width: 200px;" size="small"/>
        <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px;" @click="itemPricingRecord"></el-button>
        <el-button size="small" type="primary" plain @click="handleClearQuery">重置</el-button>
      </span>
    </div>
    <el-table :data="dataItem.items" width="100%" :height="460">
      <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
      <el-table-column label="报价时间" prop="created" width="160"/>
      <el-table-column label="商品编号/名称">
        <div slot-scope="scope" class="add-dot">{{scope.row.item.code}}/{{scope.row.item.title}}</div>
      </el-table-column>
      <el-table-column label="昨日销售价" width="100">
        <template slot-scope="scope" class="add-dot">{{returnPrice(scope.row.price_sale_last)}}</template>
      </el-table-column>
      <el-table-column label="今日销售价" width="100">
        <template slot-scope="scope" class="add-dot">{{returnPrice(scope.row.price_sale)}}</template>
      </el-table-column>
      <el-table-column label="审核人" width="110">
        <template slot-scope="scope">{{scope.row.auditor.realname}}</template>
      </el-table-column>
      <el-table-column label="审核时间" prop="created" width="160"/>
      <el-table-column label="报价人" width="110">
        <template slot-scope="scope">{{scope.row.creater.realname}}</template>
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
  import { Http, Config, Constant } from '@/util';
  import { SelectDisplayClass } from '@/common';

  export default {
    name: "DetailItemPricingRecord",
    mixins: [detailMixin],
    components: {
      'select-display-class': SelectDisplayClass
    },
    data() {
      let initQuery = {
        display_class_code: '',
        condition: '',
        page: 1,
        page_size: Constant.PAGE_SIZE,
        pickerValue: null,
      }
      let initDataItem = {
        items: [],
        num: 0
      }
      return {
        /*最近30天（以当天作为结尾，往前30天）
         本周
         上周
         本月（以本月作为选择）
         上月（以当前所在月的上一个月作为选择）
         本年
         上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE,
        initDetail: {},
        initQuery: initQuery,
        query: Object.assign({}, initQuery),
        initDataItem: initDataItem,
        dataItem: JSON.parse(JSON.stringify(initDataItem)),
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(){
        this.$data.dataItem = JSON.parse(JSON.stringify(this.initDataItem));
        this.$data.query = Object.assign({}, this.initQuery);
        
        //获取明细列表
        this.itemPricingRecord();
      },
      //获取明细列表
      async itemPricingRecord(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemPricingRecord, this.query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          this.$data.dataItem = res.data;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.$data.query.begin_date = value[0];
          this.$data.query.end_date = value[1];
        }else{
          this.$data.query.begin_date = '';
          this.$data.query.end_date = '';
        }
        this.$data.query.page = 1;
        this.itemPricingRecord();
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        this.$data.query.page_size = pageSize;
        this.$data.query.page = 1;
        this.itemPricingRecord();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.itemPricingRecord();
      },

      //重置搜索
      handleClearQuery(){
        this.$data.query = Object.assign({}, this.initQuery);
        this.itemPricingRecord();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .query{
    >span{
      margin-right: 20px;
    }
    >.label{
      margin-right: 10px;
    }
  }
</style>
