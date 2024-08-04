import {
    DoistCard,
    SubmitAction,
    TextBlock,
    TextInput,
} from "@doist/ui-extensions-core";
import { Task } from "@prisma/client";

export class AdaptiveCardService {
    static createSettingsCard(tasks: Array<Task>): DoistCard {
        const card = new DoistCard();
        card.doistCardVersion = "0.6";
        card.addItem(
            TextBlock.from({
                text: "Set how many days each task will be due starting from the creation date.",
                size: "extraLarge",
            })
        );

        tasks.forEach((task, index) => {
            card.addItem(
                TextInput.from({
                    placeholder: "Insert number",
                    isRequired: true,
                    defaultValue: `${task.daysDue}`,
                    label: `Task ${index}`,
                    id: `${task.id}`,
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
