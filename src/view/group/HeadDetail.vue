<template>
  <el-dialog :visible.sync="isShow" title="团购门店详情" width="1100px" append-to-body :close-on-click-modal="false">
    <table-group-head-detail :getPageComponents="getPageComponents" :storeDataItem="dataItem" v-if="isShow" ref="TableGroupHeadDetail" />
    <div class="title">
      <div class="left">团长管理</div>
      <div class="right">
        <el-button size="mini" type="primary" @click.native="handleAddItem" v-if="auth.isAdmin || auth.GroupHeadAdd">新增团长</el-button>
      </div>
    </div>
    <table-group-head-detail-list :getPageComponents="getPageComponents" :memberDataItem="groupDetail.members2" v-if="isShow" ref="TableGroupHeadDetailList" />
  </el-dialog>
</template>

<script>
import { Dialog, Button} from 'element-ui';
import TableGroupHeadDetail from './TableGroupHeadDetail';
import TableGroupHeadDetailList from './TableGroupHeadDetailList';
import { Http, Config } from '@/util';
import detailMixin from '@/share/mixin/detail.mixin';

export default {
  name: "HeadDetail",
  mixins: [detailMixin],
  components: {
    'el-button': Button,
    'table-group-head-detail': TableGroupHeadDetail,
    'table-group-head-detail-list': TableGroupHeadDetailList,
    'el-dialog': Dialog
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
  },
  data() {
    return {
      auth: this.$auth,
      componentName: 'HeadDetail',
      isShow: false,
      dataItem: [],
      groupDetail: {
        members: [],
        members2: []
      }
    };
  },
  methods: {
    //显示详情
    showDetail(data){
      this.$data.dataItem = [data];
      this.groupHeadStoreBindDetail(); //显示详情
    },
    //获取团购门店详情
    async groupHeadStoreBindDetail() {
      let { dataItem } = this;
      this.$loading({ isShow: true,  isWhole: true });
      let res = await Http.get(Config.api.groupHeadStoreBindDetail, {
        gb_store_id: dataItem[0].id, //团购门店id
      });
      if(res.code === 0){
        let rd = res.data;
        let ms = rd.members.filter(item => item.gb_store_id === dataItem[0].id);
        this.$data.groupDetail = {
          ...rd,
          members2: ms
        };
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
    //新增
    handleAddItem() {
      let com = this.$props.getPageComponents('HeadEdit');
      if(com){
        com.showAddEdit(this.groupDetail);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 30px 0 10px 10px;
  align-items: center;
  >.left{
    flex: 1;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
