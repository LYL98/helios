<template>
  <div>
    <el-dialog title="审核内标签" :visible="isShow" width="1200px" :before-close="handleCancel">
      <el-table :data="dataItem.items" width="100%" :height="460">
        <el-table-column type="index" :index="indexMethod" width="80" label="序号"></el-table-column>
        <el-table-column label="商品编号/名称">
          <template slot-scope="scope">{{scope.row.item.code}}/{{scope.row.item.title}}</template>
        </el-table-column>
        <el-table-column label="原内标签" width="200">
          <template slot-scope="scope">{{scope.row.cur_inner_tag.title}}</template>
        </el-table-column>
        <el-table-column label="现内标签" width="200">
          <template slot-scope="scope">{{scope.row.inner_tag.title}}</template>
        </el-table-column>
        <el-table-column label="修改人" width="120">
          <template slot-scope="scope">{{scope.row.creater.realname}}</template>
        </el-table-column>
        <el-table-column label="修改时间" prop="created" width="160"></el-table-column>
        <el-table-column label="审核状态" width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.is_declined">审核通过</span>
            <span v-else-if="scope.row.is_declined">驳回</span>
            <span v-else>待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.native="showHideAudit(scope.row)" v-if="(auth.isAdmin || auth.ItemAuditInnerTagAudit) && !scope.row.is_audited">审核</el-button>
            <el-button size="mini" type="text" v-else>-</el-button>
          </template>
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
    <!--审核弹框-->
    <el-dialog title="审核内标签" :visible="isShowAudit" width="520px" :before-close="showHideAudit">
      <el-form>
        <el-form-item label="类型">
          <el-radio v-model="isDeclined" :label="false" border size="mini">审核通过</el-radio>
          <el-radio v-model="isDeclined" :label="true" border size="mini">驳回</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="showHideAudit">取 消</el-button>
        <el-button type="primary" @click.native="handleAudit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailItemListAuditInnerTag",
    mixins: [detailMixin],
    components: {
    },
    data() {
      return {
        initDetail: {},
        query: {
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        },
        dataItem: {
          items: [],
          num: 0
        },
        isShowAudit: false,
        isDeclined: false,
        auditId: ''
      }
    },
    methods: {
      //显示新增修改(重写mixin)
      showDetail(data){
        if(data){
          this.$data.detail = JSON.parse(JSON.stringify(data));
        }else{
          this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        }
        this.itemInnerTagLogQuery();
      },
      //获取审核列表
      async itemInnerTagLogQuery(){
        this.$loading({isShow: true, isWhole: true});
        let { query } = this;
        let res = await Http.get(Config.api.itemInnerTagLogQuery, query);
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
        this.itemInnerTagLogQuery();
      },

      //翻页
      changePage(page) {
        this.$data.query.page = page;
        this.itemInnerTagLogQuery();
      },
      //操作
      showHideAudit(data){
        this.$data.isShowAudit = !this.isShowAudit;
        if(data){
          this.$data.isDeclined = false;
          this.$data.auditId = data.id || '';
        }
      },
      //确认审核
      async handleAudit(){
        let { auditId, isDeclined } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.post(Config.api.itemInnerTagAudit, {
          id: auditId,
          is_declined: isDeclined
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.showHideAudit();
          this.itemInnerTagLogQuery();
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./detail.scss";
</style>
