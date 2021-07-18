<template>
  <div class="mb-6">
    <h2 class="text-h5 text--primary darken-5">{{ title }}</h2>
    <h2 class="text-subtitle-1 text--secondary">
      {{ subtitle }}
    </h2>
  </div>
</template>

<script>
export default {
  name: "BaseHeaderModule",
  props: {
    title: {
      type: String,
      default: () => "",
    },
    subtitle: {
      type: String,
      default: () => "",
    },
  },
};
</script>

<style scoped></style>
