<template>
  <div class="content">
    <div>
      <Aside ref="aside" />
    </div>
    <div class="main" :style="{ width: 'calc(100% - ' + mainWidth + ')' }">
      <Header ref="header" />
      <div class="box">
        <transition name="slide-right" mode="out-in">
          <!-- <keep-alive> -->
            <router-view class="child-view"></router-view>
          <!-- </keep-alive> -->
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Aside from "@/components/home/Aside.vue";
import Header from "@/components/home/Header.vue";
export default {
  components: {
    Aside,
    Header,
  },
  data() {
    return {
      isCollapseWith: false,
      mainWidth: "200px",
    };
  },
  mounted() {},
  methods: {
    changeWidth() {
      this.isCollapse = !this.isCollapse;
      this.mainWidth = this.isCollapse ? "64px" : "200px";
      console.log(this.isCollapse, this.mainWidth);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: calc(100%);
  display: flex;
  background: #f1f5f8;
}
.main {
  // width:calc(100% - 200px);
  flex: 1;
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
