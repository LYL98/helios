<template>
  <div>
    <p class="labels" v-if="isCustom">
      <span class="label" :key="index" v-for="(tag, index) in validTags">{{ tag }}</span>
    </p>
    <el-tag v-else style="margin: 2px"
            :hit="true"
            :size="size"
            :key="index"
            v-for="(tag, index) in validTags">{{ tag }}</el-tag>
  </div>
</template>

<script>
import { Tag } from 'element-ui'

export default {
  name: 'Label',
  components: {
    'el-tag': Tag
  },
  computed: {
    validTags: function () {
      let tags = this.tags;
      let tmp = [];
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] !== '') {
          tmp.push(tags[i])
        }
      }
      return tmp;
    }
  },
  props: ['tags', 'size', 'isCustom'],
}
</script>

<style scoped>
.labels{
  margin-bottom: 6px;
}
.label{
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #999;
  color: #999;
  padding: 2px 6px;
  margin-right: 5px;
}
</style>
