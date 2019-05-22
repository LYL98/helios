<template>
  <el-dialog :visible.sync="isShow" title="团购门店详情" width="1100px" append-to-body :close-on-click-modal="false">
    <table-group-head-detail :getPageComponents="getPageComponents" :dataItem="dataItem" v-if="isShow" ref="TableGroupHeadDetail" />
    <div class="title">
      <div class="left">团长管理</div>
      <div class="right">
        <el-button>新增团长</el-button>
      </div>
    </div>
    <table-group-head-detail-list :getPageComponents="getPageComponents" :dataItem="groupDetail.members" v-if="isShow" ref="TableGroupHeadDetailList" />
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { Dialog, Button} from "element-ui";
import { Base, Group } from "@/service";
import { TableGroupHeadDetail, TableGroupHeadDetailList } from '@/container';
import { Request, Config } from '@/util';

export default {
  name: "HeadDetail",
  components: {
    'el-button': Button,
    'table-group-head-detail': TableGroupHeadDetail,
    'table-group-head-detail-list': TableGroupHeadDetailList,
    'el-dialog': Dialog
  },
  props: {
    getPageComponents: { type: Function, require: true }, //获取页面组件
  },
  computed: {
    ...mapGetters({
      province: "globalProvince"
    })
  },
  data() {
    return {
      componentName: 'HeadDetail',
      isShow: false,
      dataItem: [],
      groupDetail: {
        members: []
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
      this.$store.dispatch('loading', {isShow: true, isWhole: true});
      let res = await Request.requestGet(Config.api.groupHeadStoreBindDetail, {
        store_id: dataItem[0].id
      });
      if(res.code === 0){
        let rd = res.data;
        let ms = rd.members.filter(item => item.store_id === dataItem[0].id);
        this.$data.groupDetail = {
          ...rd,
          members: ms
        };
        this.$data.isShow = true;
      }else{
        this.$store.dispatch("message", {
          title: "提示",
          message: res.message,
          type: "error"
        });
      }
      this.$store.dispatch('loading', {isShow: false});
    },
  }
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
