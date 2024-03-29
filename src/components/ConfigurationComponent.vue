<template>
  <div class="col-12 full-height">
    <q-stepper
      v-model="step"
      vertical
      color="primary"
      class="full-width no-box-shadow"
      animated
    >
      <q-step
        class="q-pl-xs"
        :name="1"
        title="Select Credential Type"
        icon="settings"
        :done="step > 1"
      >
        <q-form>
          <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
            <p class="input-label q-my-xs">Credential Type
              <span class="text-red">*</span>
            </p>
            <q-select
              standout="bg-accent"
              input-class="text-standout-input"
              class="text-standout-input"
              v-model="type"
              @input="modifyType"
              :options="options"
              options-selected-class="text-secondary"
            >
              <template v-slot:prepend>
                <q-icon class="text-standout-input" name="style" />
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
          <q-stepper-navigation>
            <q-btn @click="step = 2" color="primary" label="Continue" />
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        class="q-pl-xs"
        :name="2"
        title="Set Configuration"
        icon="create_new_folder"
        :done="step > 2"
      >
        <q-form @submit.prevent="initialiseS3">
          <div class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
            <p class="input-label q-my-xs">Region
              <span class="text-red">*</span>
            </p>
            <q-select
              use-input
              @filter="filterRegion"
              standout="bg-accent"
              input-class="text-standout-input"
              class="text-standout-input"
              v-model="congnitoConfig.region"
              :options="regions"
              :rules="[selectRules]"
              options-selected-class="text-secondary"
            >
              <template v-slot:prepend>
                <q-icon class="text-standout-input" name="style" />
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
          <div v-if="type.value === 1" class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
            <p class="input-label q-my-xs">Identity Pool Id
              <span class="text-red">*</span>
            </p>
            <q-input
              input-class="text-standout-input"
              standout="bg-accent"
              type="text"
              v-model="congnitoConfig.identityPoolId"
              placeholder="Identity Pool Id"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter identity pool id',
              ]"
            >
              <template v-slot:prepend>
                <q-icon class="text-standout-input" name="perm_identity" />
              </template>
            </q-input>
          </div>
          <div v-if="type.value === 2" class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
            <p class="input-label q-my-xs">Access Key Id
              <span class="text-red">*</span>
            </p>
            <q-input
              input-class="text-standout-input"
              standout="bg-accent"
              type="text"
              v-model="congnitoConfig.accessKeyId"
              placeholder="Access Key Id"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter access key id',
              ]"
            >
              <template v-slot:prepend>
                <q-icon class="text-standout-input" name="vpn_key" />
              </template>
            </q-input>
          </div>
          <div v-if="type.value === 2" class="text-left form-data col-lg-12 col-md-12 col-sm-12 col-xs-12 q-py-xs">
            <p class="input-label q-my-xs">Secret Key
              <span class="text-red">*</span>
            </p>
            <q-input
              input-class="text-standout-input"
              standout="bg-accent"
              type="text"
              v-model="congnitoConfig.secretAccessKey"
              placeholder="Secret Key"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter your secret key',
              ]"
            >
              <template v-slot:prepend>
                <q-icon class="text-standout-input" name="password" />
              </template>
            </q-input>
          </div>
          <q-stepper-navigation>
            <q-btn flat @click.prevent="step = 1" color="primary" label="Back" class="q-ml-sm" />
            <q-btn type="submit" color="primary" label="Done" />
          </q-stepper-navigation>
        </q-form>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import Regions from 'src/helpers/regions';
import { Region, S3Config } from 'src/models/model';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'ConfigurationComponent',
  setup() {
    return { 
      step: 1,
      options: [
        {
          label: 'Cognito Identiy',
          value: 1
        },
        {
          label: 'Access Key',
          value: 2
        }
      ],
      type: ref({
        label: 'Cognito Identiy',
        value: 1
      }),
      congnitoConfig: ref({
        region: {
          label: '',
          value: '',
        },
        identityPoolId: '',
        accessKeyId: '',
        secretAccessKey: '',
      }),
      regions: ref(Regions),
      regionsFilter: ref(Regions),
    }
  },
  computed: {
    ...mapGetters({
      selectedType: 's3Store/getSelectedConfigType',
      congnitoCreds: 's3Store/getS3InitParams'
    })
  },
  created() {
    this.congnitoConfig = { ...this.congnitoCreds } as S3Config
    this.type = { ...this.selectedType } as { label: string, value: number }
  },
  methods: {
    modifyType(val: { value: number }) {
      if (val.value === 1) {
        this.congnitoConfig.accessKeyId = ''
        this.congnitoConfig.secretAccessKey = ''
      } else {
        this.congnitoConfig.identityPoolId = ''
      }
    },
    selectRules (val: Region) {
      if (!val || !val.label) {
        return 'Please Select Region'
      }
    },
    filterRegion (val: string, update: (val : () => void) => void): void {
      if (val === '') {
        update(() => {
          this.regions = this.regionsFilter
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.regions = this.regionsFilter.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    initialiseS3 () {
      this.$q.loading.show()
      this.$store.dispatch('s3Store/initialiseS3', { data: this.congnitoConfig, type: this.type })
        .then((resp) => {
          this.$q.loading.hide()
          if (resp)
           console.log('success')
            // this.isS3Init = true
        })
        .catch((err: string) => {
          console.log(err)
          this.$q.loading.hide()
          this.$q.notify({ position: 'top', message: err, color: 'negative' })
        })
    },
    changeInitStatus () {
      this.$store.commit('s3Store/CHANGE_INIT_S3', false)
    }
  },
});
</script>
