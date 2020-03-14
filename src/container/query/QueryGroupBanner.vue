<template>
</template>

<script>
  import queryMixin from './query.mixin';

  export default {
    name: "QueryGroupBanner",
    mixins: [queryMixin],
    created() {
    },
    data(){
      let initQuery = {
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery),
      }
    }
  }
</script>

<style scoped>
</style>
