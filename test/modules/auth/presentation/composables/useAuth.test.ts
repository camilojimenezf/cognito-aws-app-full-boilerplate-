import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';

import actions from '@auth/infrastructure/actions';
import authService from '@auth/infrastructure/services/auth-amplify.service';
import { useAuthStore } from '@auth/presentation/stores/auth.store';
import { useAuth } from '@auth/presentation/composables/useAuth';

describe('useAuth composable', () => {
  let authStoreMock: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    vi.clearAllMocks();

    const pinia = createTestingPinia();
    setActivePinia(pinia);
    authStoreMock = useAuthStore();
  });

  it('signIn() calls service.signIn', async () => {
    const spy = vi.spyOn(authService, 'signIn').mockResolvedValue();

    const { signIn } = useAuth();
    await signIn();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('signOut() calls service.signOut then store.signOut', async () => {
    const spySignOut = vi.spyOn(authService, 'signOut').mockResolvedValue();

    const { signOut } = useAuth();
    await signOut();
    expect(spySignOut).toHaveBeenCalledTimes(1);
    expect(authStoreMock.signOut).toHaveBeenCalledTimes(1);
  });

  it('checkAuth() returns false and calls store.signOut if getCurrentUser returns null', async () => {
    const spyGetCurrentUser = vi.spyOn(authService, 'getCurrentUser').mockResolvedValueOnce(null);
    const spySignOut = vi.spyOn(authStoreMock, 'signOut').mockResolvedValue();

    const { checkAuth } = useAuth();
    const result = await checkAuth();

    expect(result).toBe(false);
    expect(spySignOut).toHaveBeenCalledTimes(1);
    expect(spyGetCurrentUser).toHaveBeenCalledTimes(1);
    expect(authStoreMock.signOut).toHaveBeenCalledTimes(1);
    expect(authStoreMock.isAuthenticated).toBe(false);
  });

  it('checkAuth() on first login sets user, calls ensureUser, and returns true', async () => {
    const fakeAuthUser = {
      email: 'x@y.com',
      accessToken: 'tok',
      refreshToken: 'ref',
    };

    const fakeUser = {
      email: 'x@y.com',
      id: '123',
      roles: [],
    };

    vi.spyOn(authService, 'getCurrentUser').mockResolvedValueOnce(fakeAuthUser);
    const spyEnsureUser = vi.spyOn(actions, 'ensureUser').mockResolvedValue(fakeUser);

    const { checkAuth } = useAuth();
    const result = await checkAuth();
    expect(result).toBe(true);

    // how isAuthenticated was false => isFirstLogin
    expect(authStoreMock.setAuthUser).toHaveBeenCalledWith(fakeAuthUser);
    expect(spyEnsureUser).toHaveBeenCalledTimes(1);
  });

  it('checkAuth() on subsequent login sets user but does NOT call ensureUser', async () => {
    const fakeAuthUser = { email: 'x@y.com', accessToken: 'tok', refreshToken: 'ref' };
    vi.spyOn(authService, 'getCurrentUser').mockResolvedValueOnce(fakeAuthUser);
    const spyEnsureUser = vi.spyOn(actions, 'ensureUser').mockResolvedValue({
      ...fakeAuthUser,
      id: '123',
      roles: [],
    });
    authStoreMock.$patch({ authUser: fakeAuthUser });

    const { checkAuth } = useAuth();
    const result = await checkAuth();
    expect(result).toBe(true);

    expect(authStoreMock.setAuthUser).toHaveBeenCalledWith(fakeAuthUser);
    expect(spyEnsureUser).not.toHaveBeenCalled();
  });

  it('checkAuth() catches errors, calls signOut, and returns false', async () => {
    vi.spyOn(authService, 'getCurrentUser').mockRejectedValueOnce(new Error('boom'));
    const spySignOut = vi.spyOn(authStoreMock, 'signOut').mockResolvedValue();

    const { checkAuth } = useAuth();
    const result = await checkAuth();
    expect(result).toBe(false);
    expect(spySignOut).toHaveBeenCalledTimes(1);
  });

  it('refreshToken() proxies to service.refreshSession', async () => {
    vi.spyOn(authService, 'refreshSession').mockResolvedValueOnce({
      email: 'x@y.com',
      accessToken: 'tok',
      refreshToken: 'ref',
    });

    const { refreshToken } = useAuth();
    const token = await refreshToken();
    expect(authService.refreshSession).toHaveBeenCalledTimes(1);
    expect(token?.accessToken).toBe('tok');
    expect(token?.refreshToken).toBe('ref');
    expect(token?.email).toBe('x@y.com');
  });
});
