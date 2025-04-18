import {
  signOut as signOutAmplify,
  fetchAuthSession as fetchAuthSessionAmplify,
  signInWithRedirect as signInWithRedirectAmplify,
  type AuthSession,
} from 'aws-amplify/auth';
import type { IAuthService } from '@auth/domain/services/auth.service';
import type { IAuthUser } from '@auth/domain/interfaces/auth-user.interface';
import { GetCurrentUserError, RefreshSessionError } from '@auth/domain/errors/auth.errors';

function createAuthAmplifyAdapter(): IAuthService {
  const getUserFromSession = (session: AuthSession): IAuthUser | null => {
    if (!session.tokens) return null;

    const email = (session.tokens?.idToken?.payload.email as string) || '';
    const accessToken = session.tokens?.idToken?.toString() || '';
    const refreshToken = ''; // Not used in Amplify

    return { accessToken, refreshToken, email };
  };

  return {
    async signIn(): Promise<void> {
      try {
        await signInWithRedirectAmplify({ provider: 'Google' });
      } catch (error) {
        // Already authenticated — try to get user
        if (error instanceof Error && error.name === 'UserAlreadyAuthenticatedException') {
          await this.refreshSession();
        }
        console.error('Google sign-in failed:', error);
      }
    },

    async signOut(): Promise<void> {
      return signOutAmplify();
    },

    async getCurrentUser(): Promise<IAuthUser | null> {
      try {
        const session = await fetchAuthSessionAmplify();
        return getUserFromSession(session);
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new GetCurrentUserError(message);
      }
    },

    async refreshSession(): Promise<IAuthUser | null> {
      try {
        const session = await fetchAuthSessionAmplify({ forceRefresh: true });
        return getUserFromSession(session);
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new RefreshSessionError(message);
      }
    },

    async getToken(): Promise<string> {
      const session = await fetchAuthSessionAmplify();
      return session.tokens?.idToken?.toString() || '';
    },
  };
}

const authAmplifyService = createAuthAmplifyAdapter();

export default authAmplifyService;
