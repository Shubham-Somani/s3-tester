export interface SelectTag {
  label: string;
  value: string;
}

export interface Region {
  label: string;
  value: string;
}

export interface S3Config {
  region: SelectTag,
  identityPoolId: string
}

export interface GetObject {
  Key: string,
  Bucket: string
}

export interface BucketList {
  Name: string,
  CreationDate: string
}

export interface ObjectList {
  Prefix: string
}

export interface ObjectItem {
  Key: string,
  ETag: string,
  LastModified: string,
  Owner: {
    DisplayName: string,
    ID: string
  }
  Size: number,
  StorageClass: string
}
