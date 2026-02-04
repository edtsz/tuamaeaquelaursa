import Vue from 'vue';
import Vuex from 'vuex';

import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/app-check';

import { hostingConfig, firebaseConfig } from '@/../config/app.js';
import router from '@/router';

Vue.use(Vuex);

const state = {
  notFound: {
    from: 'Tua mãe, aquela ursa',
    subject: 'Correspondências não encontrada',
    bodyHtml: '<p><center>nada para exibir<br>¯\\_(ツ)_/¯<center></p>',
    created_at: Date.now(),
  },
  loading: {
    from: 'Tua mãe, aquela ursa',
    subject: 'Buscando correspondências',
    bodyHtml: '<center><pre>...</pre></center>',
    created_at: Date.now(),
  },
  messages: [],
  message:  {},
  current_page: null,
  current_params: null,
  loader : false,
  _hosting : hostingConfig,
  _user_box: null,
  _unsubscribe: null,
  _db : firebase.initializeApp(firebaseConfig).firestore(),
}

// Initialize App Check with reCAPTCHA v3
if (firebaseConfig.appCheckSiteKey) {
  try {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      // This will show the local development debug token in console
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      console.log('=== App Check Debug Mode Enabled ===');
      console.log('Add the debug token shown above to Firebase Console');
    }

    firebase.appCheck().activate(
      firebaseConfig.appCheckSiteKey,
      true // isTokenAutoRefreshEnabled
    );
  } catch (error) {
    console.error('App Check initialization failed:', error);
  }
}

state.message = state.loading;

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});


router.beforeEach((to, from, next) => {
  store.commit('current_page', to);

  if ( to.path === '/' )
    store.dispatch('clear');
  else
    store.dispatch('connect_to_box');

  next();
});

export default store
