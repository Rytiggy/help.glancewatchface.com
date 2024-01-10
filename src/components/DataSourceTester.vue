<script setup>
import { ref, computed } from "vue"
import isUrl from 'is-url';
import { useGlance } from "./glance/useGlance"
import InputElement from '../components/InputElement.vue'
import ButtonElement from "./ButtonElement.vue";
const glance = useGlance()
const url = ref("")
const token = ref("")
const dataSource = ref("")
const dexcomUsername = ref("")
const dexcomPassword = ref("")
const isUrlValidFormat = computed(() => {
  if (url.value.length === 0)
    return false
  if (!(url.value.startsWith("http://") || url.value.startsWith("https://"))) {
    return false
  }
  try {
    return isUrl(url.value)
  } catch (e) {
    console.error(e)
    //"Error: Data Source url is not valid. please verify your url"
    return false
  }
})

const apiData = computed(() => {
  return glance.data.value
})

const processedData = computed(() => {
  return glance.processedData.value
})


const apiError = computed(() => {
  return glance.error.value
})

const isUnauthorized = computed(() => {
  return apiError.value && apiError.value.error.status === 401
})

function buildUrlWithToken() {
  const urlObj = new URL(url.value)
  urlObj.searchParams.append('token', token.value);
  url.value = urlObj.href
}

async function next() {
  console.log({ dataSource: dataSource.value })
  if (token.value && dataSource.value === 'nightscout') {
    buildUrlWithToken()
  } else if (dataSource.value === 'dexcom') {
    glance.setSettings("USAVSInternational", false)
    console.log(dexcomUsername.value, dexcomPassword.value)
    glance.setSettings("dexcomUsername", dexcomUsername.value)
    glance.setSettings("dexcomPassword", dexcomPassword.value)
    url.value = "dexcom"
  }

  await glance.getData(url.value)
  await glance.processData(apiData.value)
}

// Checks if the reading is older the 5 misn
function isReadingOld(bgDate) {
  let date = new Date();

  //data from database
  console.log("db: " + Date(bgDate))
  console.log("current date: " + date)

  var FIVE_MIN = 5 * 60 * 1000;

  if ((date - Date(bgDate)) > FIVE_MIN) {
    console.log('Delayed by more than 5 mins');
    return true
  }
  return false
}


function setDataSource(val) {
  if (val === 'dexcom') {
    glance.setSettings("url", "dexcom")
    glance.setSettings("dataSource", "dexcom")
  }

  dataSource.value = val
}


</script>
<template>
  <div class="grid gutter-md">
    <section>
      <h1>Glance data source validator</h1>
      <div class="text-subtitle-1">This tool is designed to help you verify your data source.</div>
      <div>
        <h2>What does this tool do?</h2>
        <ol>
          <li>
            This tool is for the "custom" data source and "Dexcom" option in Glance's settings
          </li>
          <li>
            Validate the format of your data source's settings
          </li>
          <li>
            Validate that the data is okay and ready for Glance
          </li>
        </ol>
      </div>
    </section>
    <section>
      <h2>Select your data source</h2>
      <div class="gutter-md">
        <div class="grid gutter-md">
          <ButtonElement label="Dexcom" @click="setDataSource('dexcom')" />
          <ButtonElement label="Nightscout" @click="setDataSource('nightscout')" />
        </div>

      </div>
    </section>

    <section v-if="dataSource.length">
      <div class="gutter-md">
        <div v-if="dataSource === 'dexcom'" class="grid gutter-md">
          <h2>Dexcom</h2>
          <InputElement label="Dexcom Username" v-model="dexcomUsername" />
          <InputElement label="Dexcom Password" v-model="dexcomPassword" />
          <ButtonElement label="Validate" :disabled="dexcomUsername.length === 0 || dexcomPassword.length === 0"
            @click="next" />

        </div>
        <div v-else-if="dataSource === 'nightscout'" class="grid gutter-md">
          <h2>Nightscout</h2>

          <InputElement label="Nightscout url" v-model="url" :error="!isUrlValidFormat" />

          <InputElement v-if="isUnauthorized" label="Nightscout Token - Your Nightscout site requires authentication "
            v-model="token" :error="token.length === 0" />
          <ButtonElement label="Validate" :disabled="!isUrlValidFormat" @click="next" />

        </div>

      </div>
    </section>
    <section v-if="processedData">
      <h2>Data</h2>
      <div class="grid gutter-md">
        <div v-if="processedData.bgs && processedData.bgs[0].datetime">
          Live Readings: {{ isReadingOld(processedData.bgs[0].datetime) == false ? "Okay" : "Issues" }}
        </div>

        <div v-if="processedData.bgs">
          Data in expected format: {{ !!processedData.bgs ? "Okay" : "Issues" }}
        </div>

        <div v-if="processedData.bgs">
          47 Readings Available: {{ processedData.bgs.length === 47 ? "Okay" : "Issues" }}
        </div>


      </div>
      <div v-if="apiError" class="grid gutter-md">
        {{ apiError }}
      </div>
    </section>

  </div>
</template>
<style></style>