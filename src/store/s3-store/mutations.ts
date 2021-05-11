import { MutationTree } from 'vuex';
import { S3StateInterface } from './state';

const mutation: MutationTree<S3StateInterface> = {
  INIT_S3 (state: S3StateInterface, payload: { region: { value: string, label: string }, identityPoolId: string }) {
    state.initParams = {
      region: payload.region,
      identityPoolId: payload.identityPoolId
    }
    const params = JSON.stringify({
      region: payload.region.value,
      identityPoolId: payload.identityPoolId
    })
    state.headerParams = {
      awsparams: btoa(params)
    }
    state.isS3Init = true
  },
  CHANGE_INIT_S3 (state: S3StateInterface, payload: boolean) {
    state.isS3Init = payload
  }
};

export default mutation;
