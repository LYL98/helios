<template>
  <div>
    <query-merchant-outer-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataMerchantOuterTags"/>
    <table-merchant-outer-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataMerchantOuterTags"/>
    <add-edit-merchant-outer-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataMerchantOuterTags"/>
  </div>
</template>

<script>
  import { QueryBasicDataMerchantOuterTags, TableBasicDataMerchantOuterTags, AddEditBasicDataMerchantOuterTags } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'MerchantOuterTagsList',
    components: {
      'query-merchant-outer-tags': QueryBasicDataMerchantOuterTags,
      'table-merchant-outer-tags': TableBasicDataMerchantOuterTags,
      'add-edit-merchant-outer-tags': AddEditBasicDataMerchantOuterTags,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("业务 - 商户外标签");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

