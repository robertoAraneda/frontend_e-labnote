import { mount, createLocalVue } from "@vue/test-utils";
import Welcome from "@/components/login/Welcome.vue";

import Vuetify from "vuetify";

describe("Welcome.vue", () => {
  let localVue;
  let vuetify;
  /*
  beforeEach(() => {
    vuetify = new Vuetify()
  })
*/

  beforeEach(() => {
    localVue = createLocalVue(); // because of vuetify, we should use a localVue instance
    vuetify = new Vuetify();
  });

  it("Se muestra props.text cuando es pasado", () => {
    const text = "new message";
    const wrapper = mount(Welcome, {
      localVue,
      vuetify,
      propsData: { text },
    });
    expect(wrapper.text()).toMatch(text);
  });

  it("check if child ZipCodeInput exists", () => {
    const wrapper = mount(Welcome, {
      localVue,
      vuetify,
      propsData: { title: "Foobar" },
    });
    // We could also verify this differently
    // by checking the text content
    const title = wrapper.find(".v-card__title > span");

    expect(title.text()).toBe("Foobar");
  });
});
