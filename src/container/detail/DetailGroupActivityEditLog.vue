<template>
  <div>
    <el-dialog title="操作记录" :visible="isShow" width="1200px" :before-close="handleCancel">
      <div class="query">
        <span class="label">类型</span>
        <span>
          <el-select v-model="query.category" size="small" clearable placeholder="请选择类型" style="width: 180px;" @change="handleAnewQuery">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key) in categorys" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </span>
        <span class="label">时间</span>
        <span>
          <el-date-picker
            style="width: 224px;"
            size="small"
            v-model="query.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changePicker"/>
        </span>
        <span class="label">搜索</span>
        <span>
          <el-input placeholder="团购编号/名称" v-model="query.condition" @keyup.enter.native="handleAnewQuery" style="width: 200px;" size="small"/>
          <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px;" @click="handleAnewQuery"></el-button>
          <el-button size="small" type="primary" plain @click="handleClearQuery">重置</el-button>
        </span>
      </div>
      <el-table :data="dataItem.items" width="100%" :height="460" :row-class-name="highlightRowClassName">
        <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
        <el-table-column label="团购编号/名称">
          <template slot-scope="scope">{{scope.row.activity.tid}}/{{scope.row.activity.title}}</template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            {{categorys[scope.row.category]}}
          </template>
        </el-table-column>
        <el-table-column label="内容" width="360">
          <template slot-scope="scope">
            <span v-if="judgeOrs(scope.row.category, ['add', 'edit', 'add_item', 'edit_item'])">{{returnAttrStr(scope.row.modified_attrs)}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="120">
          <template slot-scope="scope">{{scope.row.operator.realname}}</template>
        </el-table-column>
        <el-table-column label="操作时间" prop="created" width="160"></el-table-column>
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
  </div>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailGroupActivityEditLog",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initQuery = {
        category: '',
        condition: '',
        date: null,
        begin_date: '',
        end_date: '',
        page: 1,
        page_size: Constant.PAGE_SIZE,
      }
      let initDataItem = {
        items: [],
        num: 0
      }
      return {
        initDetail: {},
        initQuery: initQuery,
        query: this.copyJson(initQuery),
        initDataItem: initDataItem,
        dataItem: this.copyJson(initDataItem),
        categorys: {
          add: '新增团购',
          edit: '修改团购',
          active: '上架团购',
          deactive: '下架团购',
          delete: '作废团购',
          add_item: '添加商品',
          delete_item: '删除商品',
          edit_item: '修改商品'
        },
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = this.copyJson(this.initDataItem);
        this.$data.query = this.copyJson(this.initQuery);
        this.groupActivityModifyLogQuery();
      },
      //获取记录列表
      async groupActivityModifyLogQuery(){
        this.$loading({isShow: true, isWhole: true});
        let { query } = this;
        let res = await Http.get(Config.api.groupActivityModifyLogQuery, {
          province_code: this.province.code,
          ...query
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.isShow = true;
          let rd = res.data;
          this.$data.dataItem = rd;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //搜索日期
      changePicker(value){
        if (value && value.length === 2) {
          this.$data.query.begin_date = value[0];
          this.$data.query.end_date = value[1];
        } else {
          this.$data.query.begin_date = '';
          this.$data.query.end_date = '';
        }
        this.$data.query.page = 1;
        this.handleAnewQuery();
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        this.$data.query.page_size = pageSize;
        this.$data.query.page = 1;
        this.groupActivityModifyLogQuery();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.groupActivityModifyLogQuery();
      },
      //第一页重新搜索
      handleAnewQuery(){
        this.$data.query.page = 1;
        this.groupActivityModifyLogQuery();
      },
      //重置搜索
      handleClearQuery(){
        this.$data.query = Object.assign({}, this.initQuery);
        this.groupActivityModifyLogQuery();
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
  @import "@/share/scss/detail.scss";
</style>
