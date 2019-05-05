<template>
  <div class="pagination-div">
    <ul class="pagination">
        <li v-if="current != 1" @click="current-- && goto(current)" ><a href="javascript:void(0);">上一页</a></li>
        <li v-else class="unusable"><a href="javascript:void(0);">上一页</a></li>
        <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
          <a href="javascript:void(0);" >{{index}}</a>
        </li>
        <li v-if="total != current && total != 0 " @click="current++ && goto(current++)"><a href="javascript:void(0);" >下一页</a></li>
        <li v-else class="unusable"><a href="javascript:void(0);" >下一页</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ['current', 'pageSize', 'total'],
  computed: {
    pages: function() {
      var pag = [];
      if (this.current < this.pageSize) {
        //如果当前的激活的项 小于要显示的条数
        //总页数和要显示的条数那个大就显示多少条
        var i = Math.min(this.pageSize, this.total);
        while (i) {
          pag.unshift(i--);
        }
      } else {
        //当前页数大于显示页数了
        var middle = this.current - Math.floor(this.pageSize / 2), //从哪里开始
          i = this.pageSize;
        if (middle > this.total - this.pageSize) {
          middle = this.total - this.pageSize + 1;
        }
        while (i--) {
          pag.push(middle++);
        }
      }
      return pag;
    }
  },
  methods: {
    goto: function(index) {
      if (index == this.current) return;
      this.current = index;
      //这里可以发送ajax请求
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .pagination-div{
    display: inline-block;
    .pagination{
      overflow: hidden;
      >li{
        float: left;
        a{
          display: block;
          border: 1px solid #999;
          height: 30px;
          line-height: 30px;
          padding: 0 15px;
        }
        &.active{
          background: #999;
          >a{
            color: #fff !important;
          }
        }
        &.unusable{
          a{
            border: 1px solid #ccc;
            color: #ccc;
          }
        }
      }
    }
  }
  
</style>
