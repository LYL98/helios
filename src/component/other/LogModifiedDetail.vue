<template>
  <div>
    <template v-if="modifiedDetail.length > 0">
      <el-row :gutter="10" class="title">
        <el-col :span="6">修改内容</el-col>
        <el-col :span="9">修改前</el-col>
        <el-col :span="9">修改后</el-col>
      </el-row>
      <el-row :gutter="10" class="content" v-for="(item, index) in modifiedDetail" :key="index">
        <el-col :span="6">{{item.attr}}</el-col>
        <el-col :span="9">{{item.before}}</el-col>
        <el-col :span="9">{{item.after}}</el-col>
      </el-row>
    </template>
    <div v-else class="none-data">无数据</div>
  </div>
</template>

<script>
  import { Row, Col } from 'element-ui';
  export default {
    name: "LogModifiedDetail",
    components: {
      'el-row': Row,
      'el-col': Col
    },
    props: {
      modifiedDetail: { type: Array, default: [] }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .title, .content{
    margin-bottom: 10px;
    &.title{
      color: #909399;
    }
  }
  .none-data{
    text-align: center;
    color: #909399;
  }
</style>
