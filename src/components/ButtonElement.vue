<script setup>

const props = defineProps({
  label: String,
})

</script>

<template>
  <button>{{ props.label }}</button>
</template>

