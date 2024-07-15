import {
    DoistCard,
    SubmitAction,
    TextBlock,
    TextInput,
} from "@doist/ui-extensions-core";

export class AdaptiveCardService {
    static createSettingsCard(initialValues: Array<number>): DoistCard {
        // TODO: this parameter is used with hardcoded data, should be fetched from db
        const card = new DoistCard();
        card.doistCardVersion = "0.6";
        card.addItem(
            TextBlock.from({
                text: "Set how many days each task will be due starting from the creation date.",
                size: "extraLarge",
            })
        );

        initialValues.forEach((value, index) => {
            card.addItem(
                TextInput.from({
                    placeholder: "Insert number",
                    isRequired: true,
                    defaultValue: `${value}`,
                    label: `Task ${index}`,
                    id: `input${index}`,
                })
            );
        });

        card.addAction(
            SubmitAction.from({
                id: "Settings.Submit",
                title: "Save Changes",
                style: "positive",
                associatedInputs: "auto",
            })
        );

        return card;
    }
}
