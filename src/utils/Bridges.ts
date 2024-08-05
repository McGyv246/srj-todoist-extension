export const tasksSetBridgeSuccess = [
    {
        bridgeActionType: "display.notification",
        notification: {
            type: "success",
            text: "All tasks correctly set",
        },
    },
    {
        bridgeActionType: "finished",
    },
];

export const tasksSetBridgeError = [
    {
        bridgeActionType: "display.notification",
        notification: {
            type: "error",
            text: "Woops, something went wrong. Try again.",
        },
    },
    {
        bridgeActionType: "finished",
    },
];

export const settingsSavedBridgeSuccess = [
    {
        bridgeActionType: "display.notification",
        notification: {
            type: "success",
            text: "Changes saved!",
        },
    },
    {
        bridgeActionType: "finished",
    },
];

export const settingsSavedBridgeError = [
    {
        bridgeActionType: "display.notification",
        notification: {
            type: "error",
            text: "Input is not valid. Insert numbers greater than 1.",
        },
    },
    {
        bridgeActionType: "finished",
    },
];
