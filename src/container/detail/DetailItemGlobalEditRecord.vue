<template>
  <el-dialog title="修改明细" :visible="isShow" width="1200px" :before-close="handleCancel">
    <el-table :data="dataItem.items" width="100%" :height="460">
      <el-table-column type="index" :index="indexMethod" width="100" label="序号"></el-table-column>
      <el-table-column label="操作时间" prop="created" width="260"/>
      <el-table-column label="操作内容" width="600">
        <template slot-scope="scope">
          <span v-if="scope.row.c === 'item_edit'">{{returnAttrStr(scope.row.modified_attrs)}}</span>
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
  </el-dialog>
</template>

<script>
  import detailMixin from './detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailItemGlobalEditRecord",
    mixins: [detailMixin],
    components: {
    },
    data() {
      return {
        initDetail: {},
        fields: {
          code: '商品编号',
          title: '商品名称',
          images: '图片',
          price_buy: '采购价',
          price_sale: '销售价',
          markup_rate: '加价率',
          sale_unit: '销售单位',
          package_spec: '包装规格',
          item_spec: '商品规格',
          origin_place: '产地',
          gross_weight: '毛重',
          net_weight: '净重',
          system_class_code: '科学分类编号',
          display_class_code: '展示分类编号',
          frame_code: '框',
          is_weigh: '是否称重',
          tags: '商品标签',
          content: '详细信息',
          price_sale_piece: '商品的件价格',
          frame: '框的信息',
          buyer_id: '业务员',
          item_stock: '商品库存',
          is_audited: '是否已审核',
          is_on_sale: '是否已上架',
          is_deleted: '是否已删除',
          order_num_max: '商品的最大订货数',
          is_presale: '商品是否预售类型',
          presale_begin: '预售开始日期',
          presale_end: '预售结束日期',
        },
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
          this.$store.dispatch('message', {message: res.message, type: 'error'});
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
        let { fields } = this;
        list.forEach(item => {
          str += fields[item] + '/';
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
