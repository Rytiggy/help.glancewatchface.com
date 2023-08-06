<script setup>
import { ref, computed } from "vue"
import isUrl from 'is-url';
import { useGlance } from "./glance/useGlance"
import InputElement from '../components/InputElement.vue'
import ButtonElement from "./ButtonElement.vue";
const glance = useGlance()
const url = ref("https://balwtallyho.my.nightscoutpro.com/pebble?token=glance-678bebd9a52b2ef0&count=47")

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

const apiError = computed(() => {
  return glance.error.value
})

async function next() {
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
            Validate the format of your data source's url.
          </li>
          <li>
            Validate that the data is okay and ready for Glance
          </li>
        </ol>
      </div>
    </section>
    <section>
      <h2>Enter the URL of your Nightscout site</h2>
      <div class="grid gutter-md">
        <InputElement label="Nightscout url" v-model="url" :error="!isUrlValidFormat" />

        <InputElement v-if="apiError && apiError.error.status === 401"
          label="Nightscout Token - Your Nightscout site requires authentication " v-model="token"
          :error="apiError.error.status === 401" />

        <ButtonElement label="Validate" :disabled="!isUrlValidFormat" @click="next" />
      </div>
    </section>
    <section v-if="apiData">
      <h2>Data</h2>
      <div class="grid gutter-md">
        <div v-if="apiData.bgs && apiData.bgs[0].datetime">
          Live Readings: {{ isReadingOld(apiData.bgs[0].datetime) == false ? "Okay" : "Issues" }}
        </div>

        <div v-if="apiData.bgs">
          Data in expected format: {{ !!apiData.bgs ? "Okay" : "Issues" }}
        </div>

        <div v-if="apiData.bgs">
          47 Readings Available: {{ apiData.bgs.length === 47 ? "Okay" : "Issues" }}
        </div>


      </div>
      <div v-if="apiError" class="grid gutter-md">
        {{ apiError }}
      </div>
    </section>

  </div>
</template>
<style></style>