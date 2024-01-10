export default class settings {
    constructor() {
        this.settings = {
            url: "",
            extraDataUrl: "",
            dataSource: "custom",
            highThreshold: "",
            lowThreshold: "",
            glucoseUnits: "",
            disableAlert: "",
            timeFormat: "",
            dateFormat: "",
            tempType: "",
            bgColor: "",
            bgColorTwo: "",
            textColor: "",
            dismissHighFor: "",
            dismissLowFor: "",
            largeGraph: false,
            treatments: false,
            highAlerts: false,
            lowAlerts: false,
            rapidRise: false,
            rapidFall: false,
            layoutOne: "iob",
            layoutTwo: "cob",
            layoutThree: "step",
            layoutFour: "heart",
            enableSmallGraphPrediction: false,
            loopstatus: false,
            enableDOW: false,
            dexcomUsername: "",
            dexcomPassword: "",
            USAVSInternational: false,
            resetAlertDismissal: "",
            staleData: "",
            staleDataAlertAfter: "",
        }
    }


    get() {
        return this.settings;
    }

    set(key, value) {
        this.settings[key] = value
    }
}