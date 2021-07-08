import { mount, createLocalVue } from "@vue/test-utils";
import LoginIndex from "@/views/pages/login/Index.vue";
import Welcome from "@/components/login/Welcome.vue";
import Login from "@/components/login/Login.vue";

import Vuetify from "vuetify";

describe("login.vue", () => {
  const localVue = createLocalVue();
  let vuetify;
  let wrapper;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(LoginIndex, {
      localVue,
      vuetify,
    });
  });

  it("renders a vue instance", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Se renderiza el componente Welcome", () => {
    const welcome = wrapper.findComponent(Welcome).exists();

    expect(welcome).toBe(true);
  });

  it("Se renderiza el componente Login", () => {
    const login = wrapper.findComponent(Login).exists();

    expect(login).toBe(true);
  });
  it("should emit an event when the action v-btn is clicked", async () => {
    const wrapper = mount(Login, {
      localVue,
      vuetify,
    });
    const button = wrapper.find(".v-btn");

    wrapper.vm.$on("handleLogin", function (msg) {
      console.log(msg);
    });

    wrapper.vm.$emit("test", "hi");

    // Here we bind a listener to the wrapper
    // instance to catch our custom event
    // https://vuejs.org/v2/api/#Instance-Methods-Events
    wrapper.vm.handleLogin = jest.fn();

    expect(wrapper.vm.handleLogin).toHaveBeenCalledTimes(0);

    // Simulate a click on the button
    button.trigger("click");

    // Ensure that our mock event was called
    expect(wrapper.vm.handleLogin).toHaveBeenCalledTimes(1);

    /*
    wrapper.vm.handleLogin = jest.fn();
    const button = wrapper.find('#sendButton');
    button.trigger('click');
    expect(wrapper.vm.handleLogin).toHaveBeenCalled();
*/
    /* const button = wrapper.find('#sendButton')
    const spy = jest.spyOn(wrapper.vm, "handleLogin")
    button.trigger('click')
    await wrapper.vm.$nextTick()
    expect(spy).toHaveBeenCalled()
    jest.restoreAllMocks()
*/
  });
});
