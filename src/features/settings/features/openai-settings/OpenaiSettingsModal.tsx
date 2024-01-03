import OpenaiSettingsController from "./OpenaiSettingsController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAITextField from "../../../../components/ui/KartAITextField";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {Settings} from "../../../../Settings";

interface OpenaiSettingsModalProps {
    controller: OpenaiSettingsController;
}


export default function ({controller}: OpenaiSettingsModalProps) {

    return <KartAIBox>


        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={StaticText.OPENAI_SETTINGS}
            loading={controller.states.loadingState.val}
        >

            <KartAISelect mb={2} fullWidth label={StaticText.GPT_VERSION}
                          value={controller.states.selectedGptVersionState.val}
                          variant="outlined"
                          onChange={controller.states.selectedGptVersionState.set}
                          options={[
                              {
                                  label: StaticText["gpt-3.5-turbo"],
                                  value: StaticText["gpt-3.5-turbo"]
                              },
                              {
                                  label: StaticText["gpt-4"],
                                  value: StaticText["gpt-4"]
                              }
                          ]}
            />
            <KartAITextField type="password"
                             defaultValue={Settings.OPENAI_KEY}
                             fullWidth
                             label={StaticText.OPENAI_KEY}
                             variant="outlined"
                             id="openai-key"
            />


        </KartAIModal>

    </KartAIBox>
}