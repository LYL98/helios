<template>
  <div>
    <div v-if="supplierType === 'global_pur'">
      <p v-for="(item, index) in supplierBinds" :key="index">{{index + 1}}、{{item.supplier.title}}</p>
    </div>
    <div v-else-if="supplierType === 'local_pur'">
      <div v-for="(item, index) in supplierBinds" :key="index" class="local-pur-item">
        <div class="title">{{item.province.title}}</div>
        <p v-for="(s, i) in item.suppliers" :key="i">
          {{i + 1}}、{{s.supplier.title}}
          <span v-if="s.is_main" class="main-span">反采供应商</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OtherItemSupplier",
    components: {
    },
    props: {
      supplierType: { type: String, default: '' }, //global_pur 预采；local_pur 反采
      supplierBinds: { type: Array, default: [] }, //供应商列表
    },
    computed: {
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .local-pur-item{
    margin-bottom: 20px;
    >.title{
      margin-bottom: 6px;
      font-weight: bold;
    }
  }
  .main-span{
    background: #ff5252;
    color: #fff;
    padding: 0 3px;
    border-radius: 3px;
    font-size: 12px;
    position: relative;
    top: -1px;
  }
</style>
