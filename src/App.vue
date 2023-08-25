<template>
  <div id="app">
    <router-view
      v-wechat-title="$route.meta.title"
      v-if="isRouterAlive"
    ></router-view>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
.el-main {
  padding: 0 !important;
}
</style>
