<template>
  <div>
    <q-expansion-item
      class="rounded-borders"
      header-class="bg-primary text-white rounded-borders"
      label="Bucket Details"
      v-model="bucketDetail"
    >
      <q-form @submit.prevent="() => { listObject.path = ''; getObjectList(); }" ref="listObjectForm">
        <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
          <p class="input-label q-my-xs">Bucket Name
            <span class="text-red">*</span>
          </p>
          <q-input
            input-class="text-standout-input"
            standout="bg-accent"
            type="text"
            v-model="listObject.bucket"
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
            label="List Bucket"
          />
        </div>
      </q-form>
    </q-expansion-item>
    <q-separator v-if="!bucketDetail"/>
    <q-breadcrumbs class="text-caption q-py-sm" v-if="listObject.path" >
      <q-breadcrumbs-el class="cursor-pointer text-blue" @click="openDirectory('')" icon="home" />
      <q-breadcrumbs-el :key="`${path}${index}`" v-for="(path, index) in pathArray">
        <span @click="openDirectory(`${pathArray.slice(0, ((index + 1) - pathArray.length)).join('/')}/`)" class="cursor-pointer text-blue" v-if="index !== (pathArray.length - 1)"> {{ path }} </span>
        <span v-else> {{ path }} </span>
      </q-breadcrumbs-el>
    </q-breadcrumbs>
    <q-input
      v-if="!bucketDetail"
      dense
      input-class="text-standout-input"
      standout="bg-accent"
      debounce="500"
      type="text"
      class="q-pb-md q-pt-sm"
      @input="(val) => filterObjects(val)"
      v-model="search"
      placeholder="Search objects"
    >
      <template v-slot:prepend>
        <q-icon class="text-standout-input" name="search" />
      </template>
    </q-input>
    <q-list v-if="objectDirectoryList.length > 0">
      <q-item class="bg-grey-1">
        <q-item-label class="text-bold text-body1 q-py-sm">Folders</q-item-label>
      </q-item>
      <q-item @click="openDirectory(directory.Prefix)" clickable class="rounded-borders q-my-sm q-pa-sm bg-grey-2" v-for="(directory, index) in objectDirectoryList" :key="`${directory.Prefix}${index}`">
        <q-item-section avatar top>
          <q-avatar icon="folder" color="primary" size="md" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-body2">
            {{ directory.Prefix.slice(0, directory.Prefix.length - 1).substring(listObject.path.length) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list v-if="objectItemList.length > 0" separator>
      <q-item class="bg-grey-1">
        <q-item-label class="text-bold text-body1 q-py-sm">Files</q-item-label>
      </q-item>
      <div v-for="(objectItem, index) in objectItemList" :key="`${objectItem.LastModified}${index}`">
        <q-item class="rounded-borders q-pa-sm bg-grey-2 q-my-xs" v-if="objectItem.Key !== listObject.path" >
          <q-item-section>
            <q-item-label class="text-body2 line-break"> {{ objectItem.Key.substring(listObject.path.length) }} </q-item-label>
            <q-item-label caption> {{ formatDate({ dateString: objectItem.LastModified, dateFormat: 'DD MMM YYYY hh:MM:SS A' }) }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>
              <q-btn 
                flat
                aria-label="Download File"
                title="Download File"
                @click.prevent="downloadFile(objectItem.Key, objectItem.Key.substring(listObject.path.length))"
                color="primary"
                icon="download"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { ObjectList, ObjectItem } from 'src/models/model';
import { formatDate } from 'src/utils/time';

export default defineComponent({
  name: 'ListObjectComponent',
  setup() {
    const objectDirectoryList: Array<ObjectList> = []
    const objectItemList: Array<ObjectItem> = []
    const pathArray: Array<string> = []
    return {
      bucketDetail: true,
      listObject: ref({
        bucket: '',
        path: ''
      }),
      pathArray: ref(pathArray),
      objectDirectoryList: ref(objectDirectoryList),
      objectItemList: ref(objectItemList),
      search: '',
      formatDate: ref(formatDate)
    }
  },
  methods: {
    filterObjects(searchVal: string) {
      this.getObjectList(searchVal)
    },
    downloadFile(key: string, fileName: string) {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/getSignedUrl', {
        bucket: this.listObject.bucket,
        key: key,
        responseContentDisposition: `attachment; filename="${fileName}"`
      })
        .then((resp: string) => {
          this.$q.loading.hide()
          const a = document.createElement('a');
          a.style.display = 'none';
          a.setAttribute('download', fileName);
          a.href = resp;
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'bottom', message: err, color: 'negative' })
        })
    },
    openDirectory(path: string) {
      this.listObject.path = path
      this.pathArray = path.slice(0, path.length - 1).split('/')
      this.getObjectList()
    },
    getObjectList(searchVal = '') {
      this.$q.loading.show()
      this.objectDirectoryList = []
      this.objectItemList = []
      this.$store.dispatch('s3Store/listObjects', {
        bucket: this.listObject.bucket,
        path: `${this.listObject.path}${searchVal}`
      })
        .then((resp: { CommonPrefixes: Array<ObjectList>, Contents: Array<ObjectItem> }) => {
          this.$q.loading.hide()
          this.bucketDetail = false
          this.objectDirectoryList = resp.CommonPrefixes || []
          this.objectItemList = resp.Contents || []
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
