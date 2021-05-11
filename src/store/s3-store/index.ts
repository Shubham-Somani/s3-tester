import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { S3StateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const s3Store: Module<S3StateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default s3Store;
