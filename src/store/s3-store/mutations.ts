import { S3Config } from 'src/models/model';
import { MutationTree } from 'vuex';
import { S3StateInterface } from './state';

const mutation: MutationTree<S3StateInterface> = {
  INIT_S3 (state: S3StateInterface, payload: { type: { label: string, value: number }, data: S3Config }) {
    state.type = payload.type
    state.initParams = {
      region: payload.data.region,
      identityPoolId: payload.data.identityPoolId,
      accessKeyId: payload.data.accessKeyId,
      secretAccessKey: payload.data.secretAccessKey
    }
    const params = JSON.stringify({
      region: payload.data.region.value,
      identityPoolId: payload.data.identityPoolId,
      accessKeyId: payload.data.accessKeyId,
      secretAccessKey: payload.data.secretAccessKey,
      type: payload.type.value
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
