<template lang="html">

  <div>
      <component :is="currentComponent" />
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import loginByPd from '@/components/login/loginByPd.vue'
import loginByVerifyCode from '@/components/login/loginByVerifyCode.vue'


  const route = useRoute();

  const currentComponent = computed(() => {
    const current_page = route.query.type || "pd";
    if (current_page === 'pd') {
      return loginByPd
    }else{
      return loginByVerifyCode
    }
  })




</script>


<style scope>


</style>
