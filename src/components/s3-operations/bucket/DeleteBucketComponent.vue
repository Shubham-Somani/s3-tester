<template>
  <div>
    <q-form @submit.prevent="deleteBucketDialog" ref="deleteBucketForm">
      <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
        <p class="input-label q-my-xs">Bucket Name
          <span class="text-red">*</span>
        </p>
        <q-input
          input-class="text-standout-input"
          standout="bg-accent"
          type="text"
          v-model="bucket"
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
      <div class="q-py-md text-right">
        <q-btn
          type="submit"
          color="secondary"
          label="Delete Bucket"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DeleteBucketComponent',
  setup() {
    return {
      bucket: ''
    }
  },
  methods: {
    deleteBucketDialog () {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the bucket <br/> <span class="text-red text-bold text-capitalize"> ${this.bucket} </span> ?`,
        html: true,
        persistent: true,
        ok: {
          color: 'secondary'
        },
        cancel: {
          color: 'secondary',
          flat: true
        }
      }).onOk(() => {
        this.deleteBucket()
      }).onCancel(() => {
        console.log('canceled')
      }).onDismiss(() => {
        console.log('dismissed')
      })
    },
    deleteBucket () {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/deleteBucket', { bucket: this.bucket })
        .then((resp: { message: string }) => {
          this.$q.notify({ position: 'bottom', message: resp.message, color: 'positive' })
          this.bucket = '';
          (this.$refs.deleteBucketForm as Vue & { resetValidation: () => boolean }).resetValidation()
          this.$q.loading.hide()
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'bottom', message: err, color: 'negative' })
        })
    }
  }
});
</script>
