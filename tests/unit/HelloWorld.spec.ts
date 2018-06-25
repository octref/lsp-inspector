import { shallowMount } from '@vue/test-utils';
import MessageDetail from '@/components/MessageDetail.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const item = {
      msgType: 'yo',
      arg: {
        a: 'a'
      }
    }
    const wrapper = shallowMount(MessageDetail, {
      propsData: { item },
    });

    expect(wrapper.classes().includes('msg-detail'))
  });
});
