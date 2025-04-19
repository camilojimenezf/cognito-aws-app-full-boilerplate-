import { shallowMount } from '@vue/test-utils';
import AuthPage from '@auth/presentation/pages/AuthPage.vue';
import GoogleSigninBtn from '@auth/presentation/components/GoogleSigninBtn.vue';

const mockSignIn = vi.fn();
vi.mock('@auth/presentation/composables/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

describe('AuthPage.vue', () => {
  let wrapper: ReturnType<typeof shallowMount>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mount page, but replace <GoogleSigninBtn> stub with real component so clicks propagate
    wrapper = shallowMount(AuthPage, {
      global: {
        components: { GoogleSigninBtn },
      },
    });
  });

  it('renders welcome header and instructions', () => {
    expect(wrapper.find('h1').text()).toBe('Welcome,');
    expect(wrapper.find('p').text()).toBe('Sign in to continue.');
  });

  it('contains the login page container with correct test-id', () => {
    expect(wrapper.attributes()['test-id']).toBe('login-page');
  });

  it('renders GoogleSigninBtn and wires click to signIn', async () => {
    const btn = wrapper.findComponent(GoogleSigninBtn);
    expect(btn.exists()).toBe(true);

    await btn.trigger('click');
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });
});
