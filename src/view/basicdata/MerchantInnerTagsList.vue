<template>
  <div>
    <query-merchant-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="QueryBasicDataMerchantInnerTags"/>
    <table-merchant-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="TableBasicDataMerchantInnerTags"/>
    <add-edit-merchant-inner-tags :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="AddEditBasicDataMerchantInnerTags"/>
  </div>
</template>

<script>
  import { QueryBasicDataMerchantInnerTags, TableBasicDataMerchantInnerTags, AddEditBasicDataMerchantInnerTags } from '@/container';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'MerchantInnerTagsList',
    components: {
      'query-merchant-inner-tags': QueryBasicDataMerchantInnerTags,
      'table-merchant-inner-tags': TableBasicDataMerchantInnerTags,
      'add-edit-merchant-inner-tags': AddEditBasicDataMerchantInnerTags,
    },
    mixins: [viewMixin],
    created() {
      documentTitle("信息 - 商户内标签列表");
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

