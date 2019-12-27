<template>
  
</template>

<script>
  import queryMixin from './query.mixin';

  export default {
    name: "QueryBasicDataSystemClass",
    mixins: [queryMixin],
    components: {
    },
    created() {
    },
    data() {
      let initQuery = {
        condition: '', //手机号、姓名
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
