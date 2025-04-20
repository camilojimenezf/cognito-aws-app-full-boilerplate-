<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <!-- Profile Icon -->
      <div class="flex justify-center">
        <div
          class="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-2xl font-bold"
        >
          {{ authStore.authUser?.email?.charAt(0).toUpperCase() }}
        </div>
      </div>

      <!-- User Info -->
      <h2 class="text-xl font-semibold mt-4 text-gray-800">
        Welcome,
        <span class="text-blue-500">{{ authStore.authUser?.email }}</span>
      </h2>
      <p class="text-gray-600 text-sm mt-2">You're logged in successfully.</p>

      <!-- Actions -->
      <div class="mt-6 space-y-3">
        <button
          @click="getProfile"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          Get Profile
        </button>
        <button
          @click="getUserProfile"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          Get Profile (User Role)
        </button>
        <button
          @click="getAdminProfile"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          Get Profile (Admin Role)
        </button>
        <button
          @click="refreshSession"
          class="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-200 cursor-pointer"
        >
          Refresh Token
        </button>
        <button
          @click="signOut"
          class="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ApiClientFactory } from "../../../../api/api.client";
import { useAuth } from "../../../auth/presentation/composables/useAuth";
import { useAuthStore } from "../../../auth/presentation/stores/auth.store";

const { signOut, refreshToken } = useAuth();
const authStore = useAuthStore();
const apiClient = ApiClientFactory.createAuthClient();

// Fetch user profile
const getProfile = async () => {
  const response = await apiClient.get("/api/auth/profile");
  console.log(response);
};

const getUserProfile = async () => {
  const response = await apiClient.get("/api/auth/profile-user");
  console.log(response);
};

const getAdminProfile = async () => {
  const response = await apiClient.get("/api/auth/profile-admin");
  console.log(response);
};

const refreshSession = async () => {
  const response = await refreshToken();
  console.log(response);
};
</script>

<style scoped></style>
