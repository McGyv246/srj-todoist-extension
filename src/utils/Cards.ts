// TODO: create cards (if I can use the proper ts class is better)
//  see https://github.com/Doist/todoist-integration-examples/blob/main/lorem-ipsum-ui-extension/src/services/adaptive-card.service.ts
import {DoistCard, TextBlock} from "@doist/ui-extensions-core";

export const mySettingsCard : DoistCard = new DoistCard();
mySettingsCard.addItem(
    TextBlock.from({
        text: "Hello Settings!",
    })
);