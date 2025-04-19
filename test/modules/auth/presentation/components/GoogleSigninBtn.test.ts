import { shallowMount } from '@vue/test-utils';
import GoogleSigninBtn from '@auth/presentation/components/GoogleSigninBtn.vue';

describe('GoogleSigninBtn.vue', () => {
  it('renders SVG and text, and emits click on button press', async () => {
    const wrapper = shallowMount(GoogleSigninBtn);

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('span').text()).toBe('Sign in with Google');

    await button.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
