import Auth from "../../../src/store/modules/auth";

let url = "";
let body = {};

jest.mock("../../../src/services/axios", () => ({
  postRequest: (_url, _body) => {
    return new Promise((resolve) => {
      url = _url;
      body = _body;
      resolve({ data: true });
    });
  },
  getRequest: (_url) => {
    return new Promise((resolve) => {
      url = _url;
      resolve({ data: true });
    });
  },
}));

describe("authenticación", () => {
  it("actions login user", async () => {
    const commit = jest.fn();
    const username = "alice";
    const password = "password";

    await Auth.actions.login({ commit }, { username, password });

    expect(url).toBe("/api/v1/auth/login");
    expect(body).toEqual({ username, password });
  });

  it("actions attempt a user", async () => {
    const commit = jest.fn();
    const state = {
      access_token: "token",
    };

    const response = await Auth.actions.attempt({ commit, state }, "token");

    console.log(response);

    expect(url).toBe("/api/auth/user");
    expect(commit).toHaveBeenCalledWith("SET_ACCESS_TOKEN", "token");
  });

  it("mutation SET_ACCESS_TOKEN", async () => {
    const state = {
      access_token: "",
    };

    Auth.mutations.SET_ACCESS_TOKEN(state, "token");

    expect(state).toEqual({
      access_token: "token",
    });
  });

  it("mutation SET_LOGIN_USER", async () => {
    const state = {
      loginUser: {
        name: "",
        rut: "",
      },
    };

    Auth.mutations.SET_LOGIN_USER(state, {
      name: "Roberto",
      rut: "15.654.738-7",
    });

    expect(state).toEqual({
      loginUser: {
        name: "Roberto",
        rut: "15.654.738-7",
      },
    });
  });
});
