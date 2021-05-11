export interface S3StateInterface {
  isS3Init: boolean
  initParams: {
    region: {
      label: string,
      value: string
    },
    identityPoolId: string
  },
  headerParams: {
    awsparams: string
  }
}

function state(): S3StateInterface {
  return {
    isS3Init: false,
    headerParams: {
      awsparams: ''
    },
    initParams: {
      region: {
        label: '',
        value: ''
      },
      identityPoolId: ''
    }
  }
};

export default state;
