<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px">
      <el-form-item label="商品编号/名称">
        {{item.code}}/{{item.title}}
        <span class="label-hint" v-if="item.after">还会来货</span>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="应出">{{item.count_real ? item.count_real + '件' : '-'}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分配">{{item.allocated_num ? item.allocated_num + '件' : '-'}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="装车">{{item.sort_num ? item.sort_num + '件' : '-'}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <div style="padding: 0 30px;">
      <el-table :data="item.items" :row-class-name="highlightRowClassName" border>
        <el-table-column label="线路" width="160">
          <template slot-scope="scope">{{scope.row.line_id}}/{{scope.row.line_title}}</template>
        </el-table-column>
        <el-table-column label="县域">
          <template slot-scope="scope">
            <div v-for="item in scope.row.cities" :key="scope.row.line_id + item.city_id" class="citie-item">
              <div class="add-dot">{{item.city_id}}/{{item.city_title}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="小计" label-class-name="sort-head" header-align="center">
          <el-table-column label="装车 / 分配 / 应出" width="160" label-class-name="sort-head" header-align="center" align="center">
            <template slot-scope="scope">
              <div v-for="item in scope.row.cities" :key="scope.row.line_id + item.city_id" class="citie-item">
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
              <div v-for="c in scope.row.cities" :key="scope.row.line_id + c.city_id" class="citie-item">
                <div>
                  <span class="sort-num">{{c.batches[index].sort_num || '-'}}</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span class="allocate-num">{{c.batches[index].num || '-'}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <div v-for="item in scope.row.cities" :key="scope.row.line_id + item.city_id" class="citie-item">
              <my-table-operate
                :list="[
                  {
                    title: '详情',
                    isDisplay: $auth.isAdmin || $auth.OperatePrintOrderDetailCity,
                    command: () => handleShowDetailCity(item)
                  }
                ]"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="returnTitle"
      :visible.sync="dialog.visible"
      width="600px"
      append-to-body
    >
      <detail-city v-if="dialog.visible" :list="dialog.list" @cancel="handleCancel" />
    </el-dialog>
    
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Form, FormItem, Row, Col, Table, TableColumn, Dialog, Button } from "element-ui";
  import { InputNumber, SelectOption } from '@/common';
  import { Http, Config } from '@/util';
  import detailCity from './detail-city';

  export default {
    name: "detail",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-table': Table,
      'el-dialog': Dialog,
      'el-table-column': TableColumn,
      'el-button': Button,
      'my-table-operate': TableOperate,
      'detail-city': detailCity
    },
    props: {
      item: { type: Object, default: { items: [] } },
    },
    data() {
      return {
        dialog: {
          visible: false,
          list: []
        },
      }
    },
    computed: {
      //标题
      returnTitle(){
        let { dialog } = this;
        let t = (dialog.city_id || '') + '/';
        t += (dialog.city_title || '') + ' - 门店详情';
        return t;
      },
      //批数量
      batchNum(){
        let { item } = this;
        if(item.items.length === 0) return 0;
        if(item.items[0].cities.length === 0) return 0;
        if(item.items[0].cities[0].batches.length === 0) return 0;
        return item.items[0].cities[0].batches.length;
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
      /**
     * 斑马线的背景颜色样式
     */
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },

      async handleShowDetailCity(data){
        let { item } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supAllocateCityDetail, {
          item_id: item.id,
          delivery_date: item.delivery_date,
          city_id: data.city_id
        });
        this.$loading({isShow: false});
        if (res.code === 0) {
          this.$data.dialog = {
            city_id: data.city_id,
            city_title: data.city_title,
            visible: true,
            list: res.data
          };
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      handleCancel(){
        this.$data.dialog = {
          visible: false,
          list: []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .citie-item{
    position: relative;
    padding-bottom: 8px;
    margin-bottom: 8px;
    &::after{
      content: ' ';
      border-bottom: 1px solid #ececec;
      position: absolute;
      left: -10px;
      right: -10px;
      bottom: 0;
    }
    &:last-child{
      margin-bottom: 0;
      padding-bottom: 0;
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
      content: '缺';
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
