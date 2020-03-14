<template>
  <div></div>
</template>

<script>
  import queryMixin from './query.mixin';

  export default {
    name: "QueryOperateTruckLoadDelay",
    components: {
    },
    mixins: [queryMixin],
    created() {
    },
    data() {
      let initQuery = {
        province_code: this.$province.code,
      }
      return {
        initQuery: initQuery,
        query: this.copyJson(initQuery)
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
