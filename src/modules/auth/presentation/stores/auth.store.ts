import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { IAuthUser } from "../../domain/interfaces/auth-user.interface";

export const useAuthStore = defineStore("auth", () => {
  const authUser = ref<IAuthUser>();

  const setAuthUser = (newAuthUser: IAuthUser) => {
    authUser.value = newAuthUser;
  };

  const signOut = () => {
    authUser.value = undefined;
  };

  return {
    // properties
    authUser,

    // actions
    setAuthUser,
    signOut,

    // getters
    isAuthenticated: computed(() => !!authUser.value),
  };
});
