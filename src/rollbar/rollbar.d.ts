import Rollbar from "rollbar";

declare module "vue/types/vue" {
  interface Vue {
    $rollbar: Rollbar;
  }
}
