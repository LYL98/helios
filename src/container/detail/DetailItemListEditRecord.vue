<template>
  <detail-layout title="操作日志" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 30px;">
      <el-table :data="dataItem.items" width="100%">
        <el-table-column type="index" :index="indexMethod" width="100" label="序号"></el-table-column>
        <el-table-column label="操作时间" prop="created" width="260"/>
        <el-table-column label="操作内容">
          <template slot-scope="scope">
            <span v-if="scope.row.category === 'item_edit'" v-html="returnAttrStr(scope.row.modified_detail)"></span>
            <span v-else-if="scope.row.category === 'item_on_ground'" v-html="'上架：' + returnAttrStr(scope.row.modified_detail)"></span>
            <span v-else>{{categorys[scope.row.category]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="160">
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
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailItemListEditRecord",
    mixins: [detailMixin],
    components: {
    },
    data() {
      return {
        initDetail: {},
        categorys: {
          item_under_ground: '下架',
          item_on_ground: '上架',
          item_out_edit: '外标签相关修改',
          item_edit: '编辑',
          item_inner_audit: '内标签审核'
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
        this.itemModifyDetail();
      },
      //获取明细列表
      async itemModifyDetail(){
        this.$loading({isShow: true, isWhole: true});
        let { query } = this;
        let res = await Http.get(Config.api.itemModifyDetail, query);
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
        this.itemModifyDetail();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.itemModifyDetail();
      },

      //返回str
      returnAttrStr(list){
        let str = '';
        list.forEach(item => {
          str += `${item.attr}：${item.before} 【改成】 ${item.after}<br/>`;
        });
        //str = str.substring(0, str.length - 1);
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
