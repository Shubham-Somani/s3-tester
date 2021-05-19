
import Constants from 'src/helpers/constatns';
import { SelectTag } from 'src/models/model';

const BucketOperations: Array<SelectTag> = [
  {
    label: 'List Bucket',
    value: Constants.LIST_BUCKET
  },
  {
    label: 'Create Bucket',
    value: Constants.CREATE_BUCKET
  },
  {
    label: 'Delete Bucket',
    value: Constants.DELETE_BUCKET
  }
]

const ObjectOperations: Array<SelectTag> = [
  {
    label: 'List Object',
    value: Constants.LIST_OBJECT
  },
  {
    label: 'Upload Object',
    value: Constants.UPLOAD_OBJECT
  },
  {
    label: 'Get Object',
    value: Constants.GET_OBJECT
  },
  {
    label: 'Delete Object',
    value: Constants.DELETE_OBJECT
  },
  {
    label: 'Generate Get Presigned URL',
    value: Constants.GENERATE_GET_PRESIGNED_URL
  },
  {
    label: 'Generate Put Presigned URL',
    value: Constants.GENERATE_PUT_PRESIGNED_URL
  }
]

const Operations: Array<SelectTag> = [
  {
    label: 'Bucket Operations',
    value: Constants.BUCKET_OPERATIONS
  },
  {
    label: 'Object Operations',
    value: Constants.OBJECT_OPERATIONS
  }
]

export {
  Operations,
  BucketOperations,
  ObjectOperations
}
