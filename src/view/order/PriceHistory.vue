<template>
  <div class="container">
    <div class="price-history">
      <div class="pre">原价：{{ returnPrice(item.amount_pre) }}</div>
      <div class="trend">
        <div class="content" v-if="item.amount_real - item.amount_pre > 0">
          加价：<span class="red">+{{ returnPrice(item.amount_real - item.amount_pre) }}</span>
        </div>
        <div class="content" v-else>
          降价：<span class="green">{{ returnPrice(item.amount_real - item.amount_pre) }}</span>
        </div>
        <div class="history">
          <div class="line"></div>
          <i class="arrow"></i>
        </div>
      </div>
      <div class="real">现价：{{ returnPrice(item.amount_real) }}</div>
    </div>
    <div class="price-history" v-if="item.is_weigh">
      <div class="pre">原重：{{ returnWeight(item.weight_pre) }}</div>
      <div class="trend">
        <div class="content" v-if="item.weight_real - item.weight_pre > 0">
          增加：<span class="red">+{{ returnWeight(item.weight_real - item.weight_pre) }}</span>
        </div>
        <div class="content" v-else>
          减少：<span class="green">{{ returnWeight(item.weight_real - item.weight_pre) }}</span>
        </div>
        <div class="history">
          <div class="line"></div>
          <i class="arrow"></i>
        </div>
      </div>
      <div class="real">现重：{{ returnWeight(item.weight_real) }}</div>
    </div>
    <div class="price-history" v-if="!item.is_weigh || (item.is_weigh && item.count_real !== item.count_pre)">
      <div class="pre">原数量：{{ item.count_pre }}</div>
      <div class="trend">
        <div class="content" v-if="item.count_real - item.count_pre > 0">
          增加：<span class="red">+{{ item.count_real - item.count_pre }}</span>
        </div>
        <div class="content" v-else>
          减少：<span class="green">{{ item.count_real - item.count_pre }}</span>
        </div>
        <div class="history">
          <div class="line"></div>
          <i class="arrow"></i>
        </div>
      </div>
      <div class="real">现数量：{{ item.count_real }}</div>
    </div>
  </div>
</template>
<script>
import { DataHandle } from '@/util';
export default {
  name: 'PriceHistory',
  props: {
    item: Object
  },
  methods: {
    returnPrice(value) {
      return DataHandle.returnPrice(value);
    },
    returnWeight(value) {
      return DataHandle.returnWeight(value);
    }
  }
}
</script>
<style lang="scss" scoped>
  .price-history {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 45px;
    font-size: 12px;
    .pre {
      text-align: left;
      min-width: 100px;
    }
    .real {
      text-align: right;
      min-width: 100px;
    }

  }
  .trend {
    display: flex;
    justify-content: center;
    position: relative;
    .content{
      position: absolute;
      bottom: 5px;
      .green {
        color: #00d600;
      }
      .red {
        color: #ff3724;
      }
    }
  }

  .history {
    display: flex;
    align-items: center;
    .line {
      width: 100px;
      height: 1px;
      background-color: #333;
    }
    .arrow {
      width: 0;
      height: 0;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 6px solid #333;
    }
  }


</style>
