import { ref } from 'vue'
import Fetch from "./fetch.js";
import Standardize from "./standardize.js";
import Settings from "./settings.js";


export function useGlance() {
    const data = ref()
    const error = ref()

    const fetch = new Fetch();
    const standardize = new Standardize();
    const settings = new Settings();

    async function getSettings() {
        return await settings.get();
    }

    async function processData(data) {
        const store = await getSettings()
        const response = standardize.bloodsugars(data, null, store)
        return response
    }

    async function getData(url) {
        error.value = undefined
        data.value = undefined
        console.log("getData", url)
        const response = await fetch.get(url);
        data.value = response;
        if (response.error) {
            error.value = response;
        }
    }



    return { data, error, getSettings, processData, getData }
}