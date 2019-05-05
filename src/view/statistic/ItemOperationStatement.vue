<!--
  商品运营报表
-->
<template>
  <div>
    <el-tabs v-model="activeTab" class="custom-statistics-tabs">
      <el-tab-pane v-if="auth.isAdmin || auth.ItemDailyAnalysisStatement" label="商品每日分析" name="first" lazy>
        <my-item-daily-analysis-statement ref="myItemDailyAnalysisStatement"></my-item-daily-analysis-statement>
      </el-tab-pane>
      <el-tab-pane v-if="auth.isAdmin || auth.ItemFluctuationStatement" label="商品波动分析" name="second" lazy>
        <my-item-fluctuation-statement ref="myItemFluctuationStatement"></my-item-fluctuation-statement>
      </el-tab-pane>
      <el-tab-pane v-if="auth.isAdmin || auth.ItemSingleAnalysisStatement" label="商品单品分析" name="third" lazy>
        <my-item-single-analysis-statement ref="myItemSingleAnalysisStatement"></my-item-single-analysis-statement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { Tabs, TabPane} from 'element-ui';
  import ItemDailyAnalysisStatement from './ItemDailyAnalysisStatement';
  import ItemSingleAnalysisStatement from './ItemSingleAnalysisStatement';
  import ItemFluctuationStatement from './ItemFluctuationStatement';

  export default {
    name: "ItemOperationStatement",
    components: {
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
      'my-item-daily-analysis-statement': ItemDailyAnalysisStatement,
      'my-item-single-analysis-statement': ItemSingleAnalysisStatement,
      'my-item-fluctuation-statement': ItemFluctuationStatement
    },
    data() {
      return {
        activeTab: 'first'
      }
    },
    computed: mapGetters({
      auth: 'globalAuth'
    }),
    created() {
      documentTitle("统计 - 商品运营报表");

      let { auth } = this;
      let tabs = Array();
      if (auth.isAdmin || auth.ItemDailyAnalysisStatement) {
        tabs.push('first')
      }
      if (auth.isAdmin || auth.ItemFluctuationStatement) {
        tabs.push('second')
      }
      if (auth.isAdmin || auth.ItemSingleAnalysisStatement) {
        tabs.push('third')
      }

      if (tabs.length > 0) {
        this.activeTab = tabs[0];
      }

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>

</style>
