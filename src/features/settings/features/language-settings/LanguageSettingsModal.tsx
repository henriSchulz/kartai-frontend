import LanguageSettingsController from "./LanguageSettingsController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {LANGUAGE_NAMES, StaticText} from "../../../../data/text/staticText";
import KartAISelect from "../../../../components/ui/KartAISelect";

interface LanguageSettingsModalProps {
    controller: LanguageSettingsController
}

export default function ({controller}: LanguageSettingsModalProps) {

    return <KartAIBox>
        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            title={StaticText.LANGAUGE_SETTINGS}
            onSubmit={controller.submit}
        >
            <KartAISelect
                label={StaticText.LANGUAGE}
                value={controller.states.selectedLanguageState.val}
                onChange={controller.states.selectedLanguageState.set}
                fullWidth
                options={Object.entries(LANGUAGE_NAMES).map(([key, value]) => ({value: key, label: value}))}
            />
        </KartAIModal>
    </KartAIBox>

}