import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { S3StateInterface } from './state';

const getters: GetterTree<S3StateInterface, StateInterface> = {
  getS3InitStatus (state: S3StateInterface): boolean {
    return state.isS3Init
  },
  getS3InitParams (state: S3StateInterface) {
    return state.initParams
  }
};

export default getters;
