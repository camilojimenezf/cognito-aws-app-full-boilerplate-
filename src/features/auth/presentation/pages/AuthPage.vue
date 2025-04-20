<template>
  <div class="flex flex-col h-full" test-id="login-page">
    <div class="px-10 bg-gray-100 basis-3/5 flex flex-col justify-center">
      <h1 class="font-semibold text-5xl text-blue-800">Welcome,</h1>
      <p class="text-lg font-semibold text-gray-500">Sign in to continue.</p>
    </div>
    <div class="flex justify-center basis-2/5 bg-blue-200">
      <div class="flex flex-col justify-center">
        <GoogleSigninBtn @click="signIn" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@auth/presentation/composables/useAuth';
import GoogleSigninBtn from '@auth/presentation/components/GoogleSigninBtn.vue';

const { signIn } = useAuth();
</script>

<style scoped></style>
