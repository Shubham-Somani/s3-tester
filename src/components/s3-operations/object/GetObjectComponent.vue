<template>
  <div>
    <q-form @submit.prevent="getObject">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="getObjectForm.bucket"
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
          v-model="getObjectForm.key"
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
      <div class="text-right">
        <q-btn
          type="submit"
          color="secondary"
          label="Get Object"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  name: 'GetObjectComponent',
  setup() {
    return {
      getObjectForm: ref({
        bucket: 'pwazabbit',
        key: 'icons/icon-512x512.png',
        responseContentDisposition: ''
      })
    }
  },
  methods: {
    getObject() {
      this.$q.loading.show()
      const fileName = this.getObjectForm.key.split('/');
      this.$store.dispatch('s3Store/getSignedUrl', {
        bucket: this.getObjectForm.bucket,
        key: this.getObjectForm.key,
        responseContentDisposition: `attachment; filename="${fileName[fileName.length - 1]}"`
      })
        .then((resp: string) => {
          this.$q.loading.hide()
          const a = document.createElement('a');
          a.style.display = 'none';
          a.setAttribute('download', fileName[fileName.length - 1]);
          a.href = resp;
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.$q.notify({ position: 'bottom', message: 'Object Downloaded Successfully', color: 'positive' })
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'top', message: err, color: 'negative' })
        })
    }
  }
});
</script>
