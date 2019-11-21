<template>
  
</template>

<script>
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryBasicDataItemInnerTags",
    mixins: [queryMixin],
    components: {
    },
    created() {
    },
    data() {
      let initQuery = {
        province_code: this.$province.code
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  
</style>
