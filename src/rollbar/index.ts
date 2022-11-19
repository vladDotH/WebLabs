import _Vue, { PluginObject } from "vue";
import Rollbar from "rollbar";

// Плагин роллбара для использования во vue
export class RollbarPlugin implements PluginObject<never> {
  constructor(readonly options: Rollbar.Configuration) {}
  install(Vue: typeof _Vue): void {
    Vue.prototype.$rollbar = new Rollbar(this.options);
  }
}
