<template>
  <div>
    <member-list ref="memberList"></member-list>
  </div>
</template>

<script>
  import MemberList from './MemberList';
  export default {
    name: "Member",
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
