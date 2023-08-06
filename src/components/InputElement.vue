<script setup>

const props = defineProps({
  modelValue: String,
  label: String,
  error: Boolean,
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>

<template>
  <label> {{ props.label }}</label>
  <input class="input" type="text" :placeholder="props.placeholder" :value="props.modelValue"
    v-on:input="updateValue($event.target.value)" :class="{
      error: props.error
    }" />
</template>

