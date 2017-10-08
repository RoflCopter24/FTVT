<template>
  <v-layout row wrap justify-center id="wrapper">
  </v-layout>
</template>

<script>
  import SystemInformation from '../helpers/SystemInformation';

  export default {
    name: 'welcome',
    components: { SystemInformation },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style scoped>
</style>
