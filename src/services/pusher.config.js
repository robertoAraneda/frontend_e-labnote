import Pusher from "pusher-js";

const { VUE_APP_PUSHER_KEY, VUE_APP_PUSHER_CLUSTER } = process.env;

Pusher.logToConsole = true;
window.Echo = new Pusher(VUE_APP_PUSHER_KEY, {
  cluster: VUE_APP_PUSHER_CLUSTER,
});
