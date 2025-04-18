import type { AuthSession } from 'aws-amplify/auth';
import * as amplifyAuth from 'aws-amplify/auth';
import { GetCurrentUserError, RefreshSessionError } from '@auth/domain/errors/auth.errors';
import authAmplifyService from '@auth/infrastructure/services/auth-amplify.service';

vi.mock('aws-amplify/auth', () => {
  return {
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
    fetchAuthSession: vi.fn(),
  };
});

describe('authAmplifyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('signIn calls Amplify signInWithRedirect', async () => {
    const spyAmplifySignIn = vi.spyOn(amplifyAuth, 'signInWithRedirect').mockResolvedValue();

    await authAmplifyService.signIn();
    expect(spyAmplifySignIn).toHaveBeenCalledTimes(1);
    expect(spyAmplifySignIn).toHaveBeenCalledWith({ provider: 'Google' });
  });

  it('signIn on UserAlreadyAuthenticatedException calls refreshSession', async () => {
    const error = new Error('already auth');
    error.name = 'UserAlreadyAuthenticatedException';
    vi.spyOn(amplifyAuth, 'signInWithRedirect').mockRejectedValueOnce(error);

    const spyRefresh = vi.spyOn(authAmplifyService, 'refreshSession').mockResolvedValue(null);

    await authAmplifyService.signIn();
    expect(spyRefresh).toHaveBeenCalledTimes(1);
  });

  it('signOut calls Amplify signOut', async () => {
    const spyAmplifySignOut = vi.spyOn(amplifyAuth, 'signOut').mockResolvedValue();

    await authAmplifyService.signOut();
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

    const user = await authAmplifyService.getCurrentUser();
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

    const user = await authAmplifyService.getCurrentUser();
    expect(user).toBeNull();
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });

  it('getCurrentUser throws GetCurrentUserError on fetch error', async () => {
    vi.spyOn(amplifyAuth, 'fetchAuthSession').mockRejectedValueOnce(new Error('fail'));
    await expect(authAmplifyService.getCurrentUser()).rejects.toBeInstanceOf(GetCurrentUserError);
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

    const user = await authAmplifyService.refreshSession();
    expect(user).toEqual({
      email: 'x@y.com',
      accessToken: 'xyz-token',
      refreshToken: '',
    });
    expect(spyAmplifyFetchSession).toHaveBeenCalledWith({ forceRefresh: true });
  });

  it('refreshSession throws RefreshSessionError on error', async () => {
    vi.spyOn(amplifyAuth, 'fetchAuthSession').mockRejectedValueOnce(new Error('refresh fail'));
    await expect(authAmplifyService.refreshSession()).rejects.toBeInstanceOf(RefreshSessionError);
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

    const token = await authAmplifyService.getToken();
    expect(token).toBe('token-123');
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });

  it('getToken returns empty string if no idToken', async () => {
    const fakeSession = { tokens: null } as unknown as AuthSession;
    const spyAmplifyFetchSession = vi
      .spyOn(amplifyAuth, 'fetchAuthSession')
      .mockResolvedValueOnce(fakeSession);

    const token = await authAmplifyService.getToken();
    expect(token).toBe('');
    expect(spyAmplifyFetchSession).toHaveBeenCalledTimes(1);
  });
});
