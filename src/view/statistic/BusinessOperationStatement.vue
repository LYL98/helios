<template>
  <div>
    <el-tabs v-model="activeTab" class="custom-statistics-tabs">
      <el-tab-pane v-if="auth.isAdmin || auth.BusinessFourRateStatement" label="业务四率表" name="first" lazy>
        <my-business-rate-statement ref="myBusinessRateStatement"></my-business-rate-statement>
      </el-tab-pane>
      <el-tab-pane v-if="auth.isAdmin || auth.BusinessFluctuationStatement" label="业务波动表" name="second" lazy>
        <my-business-fluctuation-statement ref="myBusinessFluctuationStatement"></my-business-fluctuation-statement>
      </el-tab-pane>
      <el-tab-pane v-if="auth.isAdmin || auth.BusinessStoreAnalysisStatement" label="客户分析表" name="third" lazy>
        <my-business-store-analysis-statement ref="myBusinessStoreAnalysisStatement"></my-business-store-analysis-statement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Tabs, TabPane} from 'element-ui';
import BusinessRateStatement from './BusinessRateStatement';
import BusinessFluctuationStatement from './BusinessFluctuationStatement';
import BusinessStoreAnalysisStatement from './BusinessStoreAnalysisStatement';

export default {
  name: "BusinessOperationStatement",
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'my-business-rate-statement': BusinessRateStatement,
    'my-business-fluctuation-statement': BusinessFluctuationStatement,
    'my-business-store-analysis-statement': BusinessStoreAnalysisStatement,
  },
  computed: mapGetters({
    auth: 'globalAuth'
  }),
  data() {
    return {
      activeTab: 'first'
    }
  },
  created() {
    let { auth } = this;
    let tabs = Array();
    if (auth.isAdmin || auth.BusinessFourRateStatement) {
      tabs.push('first')
    }
    if (auth.isAdmin || auth.BusinessFluctuationStatement) {
      tabs.push('second')
    }
    if (auth.isAdmin || auth.BusinessStoreAnalysisStatement) {
      tabs.push('third')
    }

    if (tabs.length > 0) {
      this.activeTab = tabs[0];
    }

    documentTitle("统计 - 业务运营报表");
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
