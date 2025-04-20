<template>
  <div class="h-screen w-full flex flex-col">
    <nav class="h-16 py-4 px-6 bg-white">
      <div class="flex items-center justify-between">
        <div class="cursor-pointer">
          <img src="../../../../assets/vue.svg" class="h-8" />
        </div>
      </div>
    </nav>
    <div class="flex-1">
      <RouterView />
    </div>
    <div
      class="h-7 flex flex-col text-center bg-blue-900 text-white text-xs justify-center"
    >
      <p>
        Copyright © {{ new Date().getFullYear() }} Boilerplate, Inc.
        {{ version }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { version } from "../../../../../package.json";
</script>
