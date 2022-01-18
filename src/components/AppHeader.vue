<script>
import AppLogo from "./AppLogo.vue";
import AppGithubCorner from "./AppGithubCorner.vue";

export default {
  components: {
    AppGithubCorner,
    AppLogo
  }
};
</script>


<template>
  <header>
    <app-github-corner/>
    <app-logo/>
  </header>
</template>


<style lang="css" scoped>

</style>