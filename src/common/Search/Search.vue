<template>
  <div>
    <ap-autocomplete records-key="search-item" ref="apInput" v-model="query"></ap-autocomplete>
    <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
  </div>
</template>

<script>
import Autocomplete from '../Autocomplete/Autocomplete'
import { Button } from 'element-ui'

export default {
  name: 'Search',
  data: function () {
    return {
      query: ''
    }
  },
  components: {
    'el-button': Button,
    'ap-autocomplete': Autocomplete
  },
  methods: {
    search () {
      this.$refs.apInput.record();
      this.$emit('onSearch', this.query)
    }
  }
}
</script>

<style scoped>

</style>
