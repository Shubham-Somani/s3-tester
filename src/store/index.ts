import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import s3Store from 'src/store/s3-store'
import createPersistedState from 'vuex-persistedstate'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  s3Store: unknown;
}

export default store(function ({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      createPersistedState()
    ],
    modules: {
      s3Store
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });

  return Store;
});
