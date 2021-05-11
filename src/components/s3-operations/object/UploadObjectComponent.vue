<template>
  <div>
    <p class="text-red text-body2 no-margin">
      * Please setup the cors before uploading file
      <q-btn
        color="primary"
        icon="launch"
        size="xs"
        @click="openCorsConfig"
        flat
      />
    </p>
    <q-form @submit.prevent="uploadObject">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="getPutURLObjectForm.bucket"
          placeholder="Bucket Name"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Bucket name is required',
          ]"
        >
          <template v-slot:prepend>
            <q-icon class="text-standout-input" name="fas fa-box-open" />
          </template>
        </q-input>
      </div>
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Object Path (key)
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="getPutURLObjectForm.key"
          placeholder="Object Path"
          lazy-rules
          :rules="[
            val => (val && val.length > 0) || 'Object path is required',
          ]"
        >
          <template v-slot:prepend>
            <q-icon class="text-standout-input" name="fas fa-box-open" />
          </template>
        </q-input>
      </div>
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs q-pb-md">
        <p class="input-label q-my-xs">ACL
          <span class="text-red">*</span>
        </p>
        <q-select
          standout="bg-accent"
          input-class="text-standout-input"
          class="text-standout-input"
          v-model="getPutURLObjectForm.acl"
          :options="aclOptions"
          options-selected-class="text-secondary"
        >
          <template v-slot:prepend>
            <q-icon class="text-standout-input" name="lock" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs q-pb-md">
        <p class="input-label q-my-xs">Select File
          <span class="text-red">*</span>
        </p>
        <q-file
          color="grey-3"
          standout="bg-accent"
          input-class="text-standout-input"
          class="text-standout-input"
          v-model="getPutURLObjectForm.file"
          :rules="[ val => !!val || 'Please select file to upload' ]"
          label="File"
        >
          <template v-slot:prepend>
            <q-icon name="attachment" />
          </template>
        </q-file>
      </div>
      <div class="text-right">
        <q-btn
          type="submit"
          color="secondary"
          label="Upload Object"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { copyToClipboard } from 'quasar';

export default defineComponent({
  name: 'UploadObjectComponent',
  setup() {
    const aclOptions = [
      'authenticated-read',
      'aws-exec-read',
      'bucket-owner-full-control',
      'bucket-owner-read',
      'private',
      'public-read',
      'public-read-write'
    ]
    return {
      getPutURLObjectForm: ref({
        bucket: '',
        key: '',
        acl: 'private',
        file: null
      }),
      aclOptions: ref(aclOptions)
    }
  },
  methods: {
    openCorsConfig() {
      this.$q.dialog({
        message: `
        <pre id="corsConfig" class="overflow-auto bg-grey-3">[
  {
      "AllowedHeaders": [
          "*"
      ],
      "AllowedMethods": [
          "HEAD",
          "GET",
          "PUT",
          "POST",
          "DELETE"
      ],
      "AllowedOrigins": [
          "*" // or comma separated domain names 
      ],
      "ExposeHeaders": [
          "ETag"
      ]
  }
]</pre>
        `,
        html: true,
        persistent: false,
        ok: {
          label: 'Copy',
          color: 'secondary'
        },
        cancel: false
      }).onOk(() => {
        copyToClipboard(document.getElementById('corsConfig')?.innerHTML || '')
          .then(() => {
            this.$q.notify({ position: 'bottom', message: 'URL copied to clipboard', color: 'positive' })
          })
          .catch(() => {
            // fail
          })
      }).onCancel(() => {
        console.log('canceled')
      }).onDismiss(() => {
        console.log('dismissed')
      })
    },
    uploadObject() {
      console.log('this.file --->', this.getPutURLObjectForm.file)
      this.$q.loading.show()
      this.presignedUrl = ''
      this.$store.dispatch('s3Store/uploadObject', this.getPutURLObjectForm)
        .then((resp: string) => {
          this.$q.loading.hide()
          if (resp)
            this.$q.notify({ position: 'bottom', message: 'File uploaded successfully', color: 'positive' })
          else
            this.$q.notify({ position: 'bottom', message: 'Error uploading file', color: 'negative' })
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'bottom', message: err || 'Error uploading file', color: 'negative' })
        })
    }
  }
});
</script>
