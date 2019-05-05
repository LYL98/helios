<template>

  <el-popover
    v-if="amount && Math.abs(amount) >= 100000000"
    :content="returnPrice(amount)"
    trigger="hover"
    placement="top-start"
    width="100"
  >
    <span slot="reference" style="cursor: pointer;">{{ computedPrice }}</span>
  </el-popover>
  <span v-else>{{ computedPrice }}</span>

</template>

<script>
  import { Popover } from 'element-ui';

  export default {
    name: "ToPrice",
    components: {
      'el-popover': Popover
    },
    props: {
      amount: { type: Number | String, required: true } // 输入为金额
    },
    computed: {
      computedPrice: {
        get() {

          if(!this.$props.amount) return 0;

          return Math.abs(this.$props.amount) >= 100000000 ? this.returnMillion(this.$props.amount) : this.returnPrice(this.$props.amount);

        }
      }
    },
    methods: {
      returnMillion(amount) {
        let p = (Math.abs(amount) / 1000000).toFixed(2);

        if(p.substring(p.length - 3, p.length) === '.00'){
          return amount > 0 ? '￥' + p.substring(0, p.length - 3) + '万' : '-￥' + p.substring(0, p.length - 3) + '万';
        }
        if(p.substring(p.length - 1, p.length) === '0'){
          return amount > 0 ? '￥' + p.substring(0, p.length - 1) + '万' : '-￥' + p.substring(0, p.length - 1) + '万';
        }
        return amount > 0 ? '￥' + p + '万' : '-￥' + p + '万';
      },
      returnPrice(amount) {
        let p = (Math.abs(amount) / 100).toFixed(2);

        if(p.substring(p.length - 3, p.length) === '.00'){
          return amount > 0 ? '￥' + p.substring(0, p.length - 3) : '-￥' + p.substring(0, p.length - 3);
        }
        if(p.substring(p.length - 1, p.length) === '0'){
          return amount > 0 ? '￥' + p.substring(0, p.length - 1) : '-￥' + p.substring(0, p.length - 1);
        }
        return amount > 0 ? '￥' + p : '-￥' + p;
      }
    }
  }
</script>

<style scoped>

</style>
