<template>
  <div>
    <q-list separator>
      <q-input
        dense
        input-class="text-standout-input"
        standout="bg-accent"
        type="text"
        class="q-pb-md"
        @input="(val) => filterBuckets(val)"
        v-model="search"
        placeholder="Search bucket"
      >
        <template v-slot:prepend>
          <q-icon class="text-standout-input" name="search" />
        </template>
      </q-input>
      <q-item class="q-px-none" v-for="bucket in bucketList" :key="bucket.Name">
        <q-item-section>
          <q-item-label class="text-body2"> {{ bucket.Name }} </q-item-label>
          <q-item-label caption> {{ formatDate({ dateString: bucket.CreationDate, dateFormat: 'DD MMM YYYY hh:MM:SS A' }) }} </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>
            <q-btn 
              flat
              size="sm"
              aria-label="Delete Bucket"
              title="Delete Bucket"
              color="negative"
              @click="deleteBucketDialog(bucket.Name)"
              icon="delete"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { BucketList } from 'src/models/model';
import { formatDate } from 'src/utils/time';

export default defineComponent({
  name: 'ListBucketsComponent',
  setup() {
    const bucketList: Array<BucketList> = []
    return {
      bucketList: ref(bucketList),
      bucketListFilter: ref(bucketList),
      search: '',
      formatDate: ref(formatDate)
    }
  },
  mounted() {
    this.getBucketList()
  },
  methods: {
    filterBuckets(val: string) {
      this.bucketList = this.bucketListFilter.filter(v => v.Name.toLowerCase().indexOf(val.toLowerCase()) > -1)
    },
    getBucketList() {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/listBuckets')
        .then((resp: { Buckets: Array<BucketList> }) => {
          this.$q.loading.hide()
          this.bucketList = resp.Buckets
          this.bucketListFilter = resp.Buckets
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'bottom', message: err, color: 'negative' })
        })
    },
    deleteBucketDialog (bucket: string) {
      this.$q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the bucket <br/> <span class="text-red text-bold text-capitalize"> ${bucket} </span> ?`,
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
        this.deleteBucket(bucket)
      }).onCancel(() => {
        console.log('canceled')
      }).onDismiss(() => {
        console.log('dismissed')
      })
    },
    deleteBucket (bucket: string) {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/deleteBucket', { bucket })
        .then((resp: { message: string }) => {
          this.$q.notify({ position: 'bottom', message: resp.message, color: 'positive' })
          this.getBucketList()
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
