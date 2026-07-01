<script setup>
const props = defineProps({
  tags: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const handleSelect = (tag) => {
  emit('update:modelValue', props.modelValue === tag ? '' : tag);
};
</script>

<template>
  <div class="filter-bar">
    <button
      type="button"
      class="tag"
      :class="{ active: modelValue === '' }"
      @click="emit('update:modelValue', '')"
    >全部</button>
    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      class="tag"
      :class="{ active: modelValue === tag }"
      @click="handleSelect(tag)"
    >{{ tag }}</button>
  </div>
</template>
