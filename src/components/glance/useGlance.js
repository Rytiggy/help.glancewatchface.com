import { ref } from 'vue'
import Fetch from "./fetch.js";
import Standardize from "./standardize.js";
import Settings from "./settings.js";
import Dexcom from "./dexcom.js"

export function useGlance() {
    const data = ref()
    const processedData = ref()

    const error = ref()

    const fetch = new Fetch();
    const standardize = new Standardize();
    const settings = new Settings();
    const dexcom = new Dexcom()

    async function getSettings() {
        return await settings.get();
    }

    async function setSettings(key, value) {
        settings.set(key, value);
    }

    async function processData(data) {
        processedData.value = undefined
        const store = await getSettings()
        const response = standardize.bloodsugars(data, null, store)
        processedData.value = response
        return response
    }

    async function getData(url) {
        const store = await getSettings()

        error.value = undefined
        data.value = undefined

        console.log("getData", { url, store })

        if (url === "dexcom") {
            let USAVSInternational = store.USAVSInternational;
            let subDomain = "share2";
            if (USAVSInternational) {
                subDomain = "shareous1";
            }


            let dexcomUsername = store.dexcomUsername
                ? store.dexcomUsername.replace(/\s+/g, "")
                : "";
            let dexcomPassword = store.dexcomPassword
                ? store.dexcomPassword.replace(/\s+/g, "")
                : "";
            let sessionId = await dexcom.getSessionId(
                dexcomUsername,
                dexcomPassword,
                subDomain
            );
            if (store.dexcomUsername && store.dexcomPassword) {
                data.value = await dexcom.getData(sessionId, subDomain);
                console.log("dexcom getData", data.value)

            } else {
                data.value = {
                    error: {
                        status: "500",
                    },
                };
            }
        } else {
            const response = await fetch.get(url);
            data.value = response;
            if (response.error) {
                error.value = response;
            }
        }
    }



    return { data, processedData, error, getSettings, setSettings, processData, getData }
}