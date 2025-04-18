import type { AuthSession } from 'aws-amplify/auth';
import * as amplifyAuth from 'aws-amplify/auth';
import { GetCurrentUserError, RefreshSessionError } from '@auth/domain/errors/auth.errors';
import { createAuthAmplifyAdapter } from '@auth/infrastructure/services/auth-amplify.service';

vi.mock('aws-amplify/auth', () => {
  return {
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
    fetchAuthSession: vi.fn(),
  };
});

describe('createAuthAmplifyAdapter', () => {
  let service: ReturnType<typeof createAuthAmplifyAdapter>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = createAuthAmplifyAdapter();
  });

  it('signIn calls Amplify signInWithRedirect', async () => {
    const spyAmplifySignIn = vi.spyOn(amplifyAuth, 'signInWithRedirect').mockResolvedValue();

    await service.signIn();
    expect(spyAmplifySignIn).toHaveBeenCalledTimes(1);
    expect(spyAmplifySignIn).toHaveBeenCalledWith({ provider: 'Google' });
  });

  it('signIn on UserAlreadyAuthenticatedException calls refreshSession', async () => {
    const error = new Error('already auth');
    error.name = 'UserAlreadyAuthenticatedException';
    vi.spyOn(amplifyAuth, 'signInWithRedirect').mockRejectedValueOnce(error);

    const spyRefresh = vi.spyOn(service, 'refreshSession').mockResolvedValue(null);

    await service.signIn();
    expect(spyRefresh).toHaveBeenCalledTimes(1);
  });

  it('signOut calls Amplify signOut', async () => {
    const spyAmplifySignOut = vi.spyOn(amplifyAuth, 'signOut').mockResolvedValue();

    await service.signOut();
    expect(spyAmplifySignOut).toHaveBeenCalledTimes(1);
  });

  it('getCurrentUser returns IAuthUser on valid session', async () => {
    const fakeSession = {
      tokens: {
        idToken: {
          payload: { email: 'a@b.com' },
          toString: () => 'abc-token',
        },
        accessToken: {
          payload: { email: 'a@b.com' },
          toString: () => 'abc-token',
        },
      },
    } as AuthSession;

    const spyAmplifyFetchSession = vi
      .spyOn(amplifyAuth, 'fetchAuthSession')
      .mockResolvedValueOnce(fakeSession);

    const user = await service.getCurrentUser();
    expect(user).toEqual({
      email: 'a@b.com',
      accessToken: 'abc-token',
      refreshToken: '',
    });
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });

  it('getCurrentUser returns null if no tokens', async () => {
    const fakeSession = { tokens: null } as unknown as AuthSession;
    const spyAmplifyFetchSession = vi
      .spyOn(amplifyAuth, 'fetchAuthSession')
      .mockResolvedValueOnce(fakeSession);

    const user = await service.getCurrentUser();
    expect(user).toBeNull();
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });

  it('getCurrentUser throws GetCurrentUserError on fetch error', async () => {
    vi.spyOn(amplifyAuth, 'fetchAuthSession').mockRejectedValueOnce(new Error('fail'));
    await expect(service.getCurrentUser()).rejects.toBeInstanceOf(GetCurrentUserError);
  });

  it('refreshSession returns IAuthUser when forceRefresh succeeds', async () => {
    const fakeSession = {
      tokens: {
        idToken: {
          payload: { email: 'x@y.com' },
          toString: () => 'xyz-token',
        },
        accessToken: {
          payload: { email: 'x@y.com' },
          toString: () => 'xyz-token',
        },
      },
    } as AuthSession;

    const spyAmplifyFetchSession = vi
      .spyOn(amplifyAuth, 'fetchAuthSession')
      .mockResolvedValueOnce(fakeSession);

    const user = await service.refreshSession();
    expect(user).toEqual({
      email: 'x@y.com',
      accessToken: 'xyz-token',
      refreshToken: '',
    });
    expect(spyAmplifyFetchSession).toHaveBeenCalledWith({ forceRefresh: true });
  });

  it('refreshSession throws RefreshSessionError on error', async () => {
    vi.spyOn(amplifyAuth, 'fetchAuthSession').mockRejectedValueOnce(new Error('refresh fail'));
    await expect(service.refreshSession()).rejects.toBeInstanceOf(RefreshSessionError);
  });

  it('getToken returns idToken string', async () => {
    const fakeSession = {
      tokens: {
        idToken: {
          toString: () => 'token-123',
        },
      },
    } as AuthSession;

    const spyAmplifyFetchSession = vi
      .spyOn(amplifyAuth, 'fetchAuthSession')
      .mockResolvedValueOnce(fakeSession);

    const token = await service.getToken();
    expect(token).toBe('token-123');
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });

  it('getToken returns empty string if no idToken', async () => {
    const fakeSession = { tokens: null } as unknown as AuthSession;
    const spyAmplifyFetchSession = vi
      .spyOn(amplifyAuth, 'fetchAuthSession')
      .mockResolvedValueOnce(fakeSession);

    const token = await service.getToken();
    expect(token).toBe('');
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });
});
