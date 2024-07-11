export const myBridgesSuccess = [
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

export const myBridgesError = [
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
