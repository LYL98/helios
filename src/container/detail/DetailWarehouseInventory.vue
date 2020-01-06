<template>
  <detail-layout title="售后单详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-table :data="dataItem.items" width="100%" :height="460">
      <el-table-column type="index" :index="indexMethod" width="100" label="序号"></el-table-column>
      <el-table-column label="操作时间" prop="created" width="260"/>
      <el-table-column label="操作内容" width="600">
        <template slot-scope="scope">
          <span v-if="scope.row.category === 'item_edit'">{{returnAttrStr(scope.row.modified_attrs)}}</span>
          <span v-else>{{categorys[scope.row.category]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">{{scope.row.operator.realname}}</template>
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
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailWarehouseInventory",
    mixins: [detailMixin],
    components: {
    },
    data() {
      return {
        initDetail: {},
        categorys: {
          item_edit: '编辑商品',
          item_add: '添加商品',
          item_delete: '删除商品',
          item_recover: '恢复商品'
        },
        query: {
          id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        dataItem: {
          items: [],
          num: 0
        },
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = {
          items: [],
          num: 0
        };
        this.$data.query.page = 1;
        if(data){
          this.$data.detail = JSON.parse(JSON.stringify(data));
        }else{
          this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        }
        
        //获取明细列表
        this.$data.query.id = data.id;
        this.pItemModifyDetail();
      },
      //获取明细列表
      async pItemModifyDetail(){
        this.$loading({isShow: true, isWhole: true});
        let { query } = this;
        let res = await Http.get(Config.api.pItemModifyDetail, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          let rd = res.data;
          this.$data.dataItem = rd;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        this.$data.query.page_size = pageSize;
        this.$data.query.page = 1;
        this.pItemModifyDetail();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.pItemModifyDetail();
      },

      //返回str
      returnAttrStr(list){
        let str = '';
        list.forEach(item => {
          str += item + '/';
        });
        str = str.substring(0, str.length - 1);
        return str;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
  .amount{
    >.up{
      color: #F8931D;
      &::before{
        content: '+';
      }
    }
    >.down{
        color: #76C627;
        &::before{
          content: '-';
        }
    }
  }
</style>
