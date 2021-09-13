<template>
  <div>
    <div>
      {{ count }}
    </div>
    <button @click="onAddClick"> 自增 </button>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  const count = ref(0);

  function onAddClick() {
    count.value++;
  }
</script>
<style lang="less" scoped></style>
