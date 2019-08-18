<template>
  <div>
    <el-tabs v-model="activeTab" class="custom-statistics-tabs">
      <el-tab-pane v-if="auth.isAdmin || auth.GroupBuyItemStatement" label="商品统计" name="first" lazy>
        <my-group-buy-item-statement ref="myGroupBuyItemStatement"></my-group-buy-item-statement>
      </el-tab-pane>
      <el-tab-pane v-if="auth.isAdmin || auth.GroupBuyCaptainStatement" label="团购门店统计" name="second" lazy>
        <my-group-buy-captain-statement ref="myGroupBuyCaptainStatement"></my-group-buy-captain-statement>
      </el-tab-pane>
      <el-tab-pane v-if="auth.isAdmin || auth.GroupBuyMemberStatement" label="团员统计" name="third" lazy>
        <my-group-buy-member-statement ref="myGroupBuyMemberStatement"></my-group-buy-member-statement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Tabs, TabPane} from 'element-ui';
import GroupBuyItemStatement from './GroupBuyItemStatement';
import GroupBuyCaptainStatement from './GroupBuyCaptainStatement';
import GroupBuyMemberStatement from './GroupBuyMemberStatement';

export default {
  name: "GroupBuyStatement",
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'my-group-buy-item-statement': GroupBuyItemStatement,
    'my-group-buy-captain-statement': GroupBuyCaptainStatement,
    'my-group-buy-member-statement': GroupBuyMemberStatement,
  },
  data() {
    return {
      activeTab: 'first',
      auth: this.$auth
    }
  },
  created() {
    let { auth } = this;
    let tabs = Array();
    if (auth.isAdmin || auth.GroupBuyItemStatement) {
      tabs.push('first')
    }
    if (auth.isAdmin || auth.GroupBuyCaptainStatement) {
      tabs.push('second')
    }
    if (auth.isAdmin || auth.GroupBuyMemberStatement) {
      tabs.push('third')
    }

    if (tabs.length > 0) {
      this.activeTab = tabs[0];
    }

    documentTitle("团购 - 团购统计");
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
