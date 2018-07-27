<template>
  <div class="header">
    <div class="logout" title="退出" @click="handleLogout">
      <I type="logout"></I>
    </div>
    <div class="user" v-text="userName"></div>
    <div class="avatar">
      <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"></Avatar>
    </div>
  </div>
</template>

<script>
import I from "@/components/I";
import auth from "@/utils/auth";

export default {
  data() {
    return {
      userName: auth.get().manager
    };
  },
  name: "header",
  components: {
    I
  },
  methods: {
    handleLogout() {
      this.$router.push("/logout");
      this.$Message.success("退出成功");
    }
  }
};
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
