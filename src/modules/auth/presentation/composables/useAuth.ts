import { createAuthAmplifyAdapter } from '@auth/infrastructure/services/auth-amplify.service';
import { ensureUser as ensureUserAction } from '@auth/infrastructure/actions/ensure-user.api.action';
import { useAuthStore } from '@auth/presentation/stores/auth.store';

const authService = createAuthAmplifyAdapter();

export const useAuth = () => {
  const authStore = useAuthStore();

  const signIn = async () => {
    await authService.signIn();
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const authUser = await authService.getCurrentUser();
      const isLoggedIn = !!authUser;

      if (!isLoggedIn) {
        authStore.signOut();
        return false;
      }

      const isFirstLogin = !authStore.isAuthenticated;

      authStore.setAuthUser({
        accessToken: authUser.accessToken,
        refreshToken: authUser.refreshToken,
        email: authUser.email,
      });

      if (isFirstLogin) {
        await ensureUserAction();
      }

      return true;
    } catch (error) {
      console.error(error);
      await signOut();
      return false;
    }
  };

  const signOut = async () => {
    await authService.signOut();
    authStore.signOut();
  };

  const refreshToken = async () => {
    return await authService.refreshSession();
  };

  return { signIn, signOut, checkAuth, refreshToken };
};
