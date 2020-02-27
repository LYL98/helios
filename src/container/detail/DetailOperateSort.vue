<template>
  <detail-layout title="商品分配详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <el-form-item label="商品编号/名称">
        {{detail.code}}/{{detail.title}}
        <span class="label-hint" v-if="detail.after">还会来货</span>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="应出">{{returnUnit(detail.count_real, '件', '-')}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入场">{{returnUnit(detail.num, '件', '-')}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分配">{{returnUnit(detail.allocated_num, '件', '-')}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="装车">{{returnUnit(detail.sort_num, '件', '-')}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <div style="padding: 0 30px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName" border>
        <el-table-column label="线路" width="160">
          <template slot-scope="scope">{{scope.row.line_code}}/{{scope.row.line_title}}</template>
        </el-table-column>
        <el-table-column label="县域">
          <template slot-scope="scope">
            <div v-for="item in scope.row.cities" :key="scope.row.line_code + item.city_code" class="citie-item add-dot">
              {{item.city_code}}/{{item.city_title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="小计" label-class-name="sort-head" header-align="center">
          <el-table-column label="装车 / 分配 / 应出" width="160" label-class-name="sort-head" header-align="center" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.cities" :key="scope.row.line_code + item.city_code" class="citie-item">
                <div :class="returnTotalClass(item)">
                  <span class="sort-num">{{item.sort_num || '-'}}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span class="allocate-num">{{item.num || '-'}}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span class="count-real">{{item.count_real || '-'}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        
        <!--画横向批n-->
        <el-table-column :label="`批${index + 1}`" v-for="(item, index) in batchNum" :key="index" label-class-name="sort-head" header-align="center">
          <el-table-column label="装车 / 分配" width="160" label-class-name="sort-head" header-align="center" align="center">
            <template slot-scope="scope">
              <div v-for="c in scope.row.cities" :key="scope.row.line_code + c.city_code" class="citie-item">
                <div>
                  <span class="sort-num">{{c.out_stocks[index].sort_num || '-'}}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span class="allocate-num">{{c.out_stocks[index].num || '-'}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <div v-for="item in scope.row.cities" :key="scope.row.line_code + item.city_code" class="citie-item">
              <my-table-operate
                :list="[
                  {
                    title: '详情',
                    isDisplay: auth.isAdmin || auth.OperateSortDetailCity,
                    command: () => handleShowDetail('DetailOperateSortCity', {
                      ...item,
                      item_id: detail.id,
                      city_code: item.city_code,
                      delivery_date: detail.delivery_date
                    })
                  }
                ]"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!---->
    <div></div>
  </detail-layout>
</template>

<script>
  import { TableOperate } from '@/common';
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateSort",
    mixins: [detailMixin],
    components: {
      'my-table-operate': TableOperate
    },
    data() {
      let initDetail = {
        allocates: [],
        out_stock: {},
        creator: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: []
      }
    },
    computed: {
      //批数量
      batchNum(){
        let { dataItem } = this;
        if(dataItem.length === 0) return 0;
        if(dataItem[0].cities.length === 0) return 0;
        if(dataItem[0].cities[0].out_stocks.length === 0) return 0;
        return dataItem[0].cities[0].out_stocks.length;
      },
    },
    methods: {
      //返回提醒样式
      returnTotalClass(data){
        let cr = Number(data.count_real);//应出
        let an = Number(data.num); //分配
        let sn = Number(data.sort_num); //装车
        if(cr > an){
          return 'sort-num-warn stockout-warn';
        }
        return '';
      },
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = [];
        this.$data.detail = this.copyJson(data);
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
          //造数据start
          /*rd[0].cities[0].out_stocks.push(rd[0].cities[0].out_stocks[0]);
          rd[0].cities[0].out_stocks.push(rd[0].cities[0].out_stocks[0]);
          rd[0].cities[0].out_stocks.push(rd[0].cities[0].out_stocks[0]);
          rd[0].cities.push(rd[0].cities[0]);
          rd[0].cities.push(rd[0].cities[0]);
          rd[0].cities.push(rd[0].cities[0]);
          rd.push(rd[0]);*/
          //造数据end
          this.$data.dataItem = rd;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .label-hint{
    border: 1px solid #ff5252;
    color: #ff5252;
    border-radius: 3px;
    padding: 0 2px;
    font-size: 12px;
  }
  .citie-item{
    position: relative;
    padding: 4px 0;
    height: 36px;
    &::after{
      content: ' ';
      border-bottom: 1px solid #ececec;
      position: absolute;
      left: -10px;
      right: -10px;
      bottom: 0;
    }
    &:last-child{
      &::after{
        border-bottom: 0;
      }
    }
  }
  //缺货
  .stockout-warn{
    position: relative;
    &::after{
      position: absolute;
      content: '缺货';
      background: #ff5252;
      color: #fff;
      font-size: 12px;
      padding: 0 2px;
      border-radius: 3px;
      margin-left: 10px;
      height: 16px;
      line-height: 16px;
    }
  }
  //装车数量变动
  .sort-num-warn{
    >.sort-num{
      color: #ff5252;
      font-weight: bold;
    }
  }
  //分配数量变动
  .allocate-num-warn{
    >.allocate-num{
      color: #ff5252;
      font-weight: bold;
    }
  }
</style>
<style lang="scss">
  .el-table th.sort-head{
    padding: 2px 0;
  }
</style>
