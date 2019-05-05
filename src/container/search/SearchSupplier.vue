<template>
  <el-autocomplete
    v-model="title"
    :clearable="clearable"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholder"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script>
  import { Autocomplete, Button } from 'element-ui';
  import { Base } from '@/service';

  export default {
    name: "SearchSupplier",
    components: {
      'el-autocomplete': Autocomplete,
      'el-button': Button
    },
    props: {
      item: { type: Object, required: true },
      placeholder: { type: String, default: '输入供应商名称查询选择' },
      clearable: { type: Boolean, default: true }
    },
    model: {
      prop: 'item',
      event: 'select'
    },
    data() {
      let { title } = this.$props.item;
      return {
        itemList: [],
        title: title
      }
    },
    watch: {
      title: function(next, pre) {
        // 如果用户清空了输入值，则初始化双向绑定的对象值。
        if (!next) {
          this.$emit('select', { id: '', title: '' });
        }
      }
    },
    methods: {
      querySearchAsync(queryString, cb) {
        this.baseSupplierList({query: queryString}, items => cb(items));
      },
      handleSelect(item) {
        this.$emit('select', item)
      },
      async baseSupplierList({query, id}, callback) {
        let res = await Base.baseSupplierList({
          condition: query
        });
        if (res.code === 0) {
          let rd = res.data;
          rd.map(item => item.value = item.name);
          callback(rd)
        }

      }
    }
  }
</script>

<style scoped>

</style>
