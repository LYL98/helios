<template>
  <div style="margin-right: 10px;">
    <el-date-picker
      size="small"
      v-model="query.delivery_date"
      value-format="yyyy-MM-dd"
      @change="handleQuery"
      style="width: 100%;"
      placeholder="配送日期"
      :clearable="false"
    />
  </div>
</template>

<script>
  import subMenuQueryMixin from '@/view/submenu.query.mixin';
  import { Constant } from '@/util';
  
  export default {
    name: "MenuQuery",
    mixins: [subMenuQueryMixin],
    inject: ['setGlobalQuery', 'getGlobalQuery'],
    props: {
      fromPage: { type: String, default: '' }, //Sort、TruckLoad、TruckLoadDelay
    },
    components: {
    },
    created() {
      let q = this.getGlobalQuery();
      let deliveryDate = q.delivery_date || this.today;
      this.$data.query.delivery_date = deliveryDate;
      if(!q.delivery_date){
        this.setGlobalQuery({ delivery_date: deliveryDate });
      }
    },
    data() {
      return {
        query: {
          delivery_date: ''
        }
      }
    },
    methods: {
      //搜索
      handleQuery(){
        this.setGlobalQuery(this.query);
        let { fromPage } = this;
        let pages = {
          Sort: 'TableOperateSort',
          TruckLoad: 'TableOperateTruckLoad',
          TruckLoadDelay: 'TableOperateTruckLoadDelay',
        }
        let pc = this.getPageComponents(pages[fromPage]);
        if(pc) pc.getData(pc.query);
      }
    }
  }
</script>

<style scoped>

</style>
