<template>
  <div>
    <member-list :getPageComponents="viewGetPageComponents" :windowHeight="viewWindowHeight" ref="memberList"></member-list>
  </div>
</template>

<script>
  import MemberList from './MemberList';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: "Member",
    mixins: [viewMixin],
    components: {
      'member-list': MemberList
    },
    created() {
      documentTitle('团购 - 团员列表');
    }
  }
</script>

<style scoped>

</style>
