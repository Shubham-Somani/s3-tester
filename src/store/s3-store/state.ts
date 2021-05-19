export interface S3StateInterface {
  isS3Init: boolean
  type: { label: string, value: number },
  initParams: {
    region: {
      label: string,
      value: string
    },
    identityPoolId: string,
    accessKeyId: string,
    secretAccessKey: string
  },
  headerParams: {
    awsparams: string
  }
}

function state(): S3StateInterface {
  return {
    isS3Init: false,
    type: {
      label: 'Cognito Identiy',
      value: 1
    },
    headerParams: {
      awsparams: ''
    },
    initParams: {
      region: {
        label: '',
        value: ''
      },
      identityPoolId: '',
      accessKeyId: '',
      secretAccessKey: ''
    }
  }
};

export default state;
