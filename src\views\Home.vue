<template>
  <div class="content">
    <div>
      <Aside ref="aside" />
    </div>
    <div class="main">
      <Header ref="header" />
      <div class="box">
        <transition name="slide-right" mode="out-in">
          <keep-alive>
            <router-view class="child-view"></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Aside from '@/components/home/Aside.vue'
import Header from '@/components/home/Header.vue'
export default {
  components: {
    Aside,
    Header
  },
  data() {
    return {
    }
  },
  watch: {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.content {
  width: calc(100%);
  display: flex;
  background: #f1f5f8;
}

.main {
  flex: 1;
  // width: calc(100%);
}

.box {
  height: calc(100vh - 60px);
  box-sizing: border-box;
  overflow-y: auto;
  padding: 20px 20px 0 20px;
}

.child-view {
  transition: all 0.3s;
}
.slide-right-leave-active {
  opacity: 0;
  // -webkit-transform: translate(100%, 0);
  // transform: translate(100%, 0);
}
.slide-right-enter {
  opacity: 0;
  // -webkit-transform: translate(-100%, 0);
  // transform: translate(-100%, 0);
}
</style>
