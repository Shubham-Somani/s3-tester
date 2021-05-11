/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { S3StateInterface } from './state';
import axios from 'axios'

const actions: ActionTree<S3StateInterface, StateInterface> = {
  initialiseS3 (context, payload: { data: { region: { value: string }, identityPoolId: string } }) {
    context.commit('INIT_S3', payload.data)
    return true
  },
  async listBuckets (context) {
    return new Promise((resolve, reject) => {
      axios({ url: 'http://localhost:3000/api/v1/bucket', headers: context.state.headerParams, method: 'GET' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async createBucket (context, payload: { bucket: string, acl: string }) {
    return new Promise((resolve, reject) => {
      axios({ url: 'http://localhost:3000/api/v1/bucket', data: payload, headers: context.state.headerParams, method: 'POST' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async deleteBucket (context, payload: { bucket: string }) {
    return new Promise((resolve, reject) => {
      axios({ url: `http://localhost:3000/api/v1/bucket/${payload.bucket}`, headers: context.state.headerParams, method: 'DELETE' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async listObjects (context, payload: { bucket: string, path: string }) {
    return new Promise((resolve, reject) => {
      axios({ url: `http://localhost:3000/api/v1/objects/${payload.bucket}`, data: { path: payload.path } , headers: context.state.headerParams, method: 'POST' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async deleteObject (context, payload: { bucket: string, key: string }) {
    return new Promise((resolve, reject) => {
      axios({ url: `http://localhost:3000/api/v1/object/${payload.bucket}`, data: { path: payload.key }, headers: context.state.headerParams, method: 'DELETE' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async uploadObject (context, payload: { bucket: string, key: string, acl: string, file: File }) {
    console.log('payload.file --->', payload.file)
    return new Promise((resolve, reject) => {
      axios({ url: `http://localhost:3000/api/v1/put-signed-url/${payload.bucket}`, data: { path: payload.key, acl: payload.acl, file: payload.file} , headers: context.state.headerParams, method: 'POST' })
        .then((resp: { data: { data: string } }) => {
          if (resp.data.data) {
            try {
              fetch(resp.data.data, { 
                method: 'PUT',
                body: payload.file 
                  }).then(
                    response => response
                  ).then(data => {
                      console.log(data)
                      resolve(true)
                  }).catch(() => {
                    reject(false)
                  });
            } catch (error) {
              reject(false)
            }
          } else {
            reject(false)
          }
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async getSignedUrl (context, payload: { bucket: string, key: string, responseContentDisposition?: string }) {
    return new Promise((resolve, reject) => {
      axios({ url: `http://localhost:3000/api/v1/get-signed-url/${payload.bucket}`, data: { path: payload.key, responseContentDisposition: payload.responseContentDisposition } , headers: context.state.headerParams, method: 'POST' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  },
  async getPutSignedUrl (context, payload: { bucket: string, key: string, acl: string }) {
    return new Promise((resolve, reject) => {
      axios({ url: `http://localhost:3000/api/v1/put-signed-url/${payload.bucket}`, data: { path: payload.key, acl: payload.acl } , headers: context.state.headerParams, method: 'POST' })
        .then((resp: { data: { data: unknown } }) => {
          resolve(resp.data.data)
        }).catch((err: { response: { data: { message: string } } }) => {
          reject(err.response.data.message)
        })
    })
  }
};

export default actions;
