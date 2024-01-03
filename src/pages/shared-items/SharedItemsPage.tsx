import {useAppSelector} from "../../hooks/reduxUtils";
import React, {useEffect, useMemo, useState} from "react";
import {useGlobalContext} from "../../App";
import SharedItemsController from "./SharedItemsController";
import KartAIBox from "../../components/ui/KartAIBox";
import ListView from "../../components/list-view/ListView";
import ListViewHead from "../../components/list-view/ListViewHead";
import {StaticText} from "../../data/text/staticText";
import {Public} from "@mui/icons-material";
import ListViewContent from "../../components/list-view/ListViewContent";
import SharedItemsViewItem from "./components/SharedItemsViewItem";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import KartAIContainer from "../../components/ui/KartAIContainer";
import {Divider} from "@mui/material";
import {lightBorderColor} from "../../styles/root";
import SharedItem from "../../types/dbmodel/SharedItem";
import UnshareItemController from "./features/unshare-item/UnshareItemController";
import UnshareItemModal from "./components/UnshareItemModal";
import KartAIInfoText from "../../components/ui/KartAIInfoText";


export default function () {


    const {snackbar, loadingBackdrop, topLevelInitDone} = useGlobalContext()

    const sharedItemsMap = useAppSelector(state => state.sharedItems.value)

    const [loadingState, setLoadingState] = useState(false)
    const [initDone, setInitDone] = useState(false)
    const [tempSelectedSharedItem, setTempSelectedSharedItem] = useState<SharedItem | null>(null)
    const [showUnshareItemModal, setShowUnshareItemModal] = useState(false)


    const controller = new SharedItemsController({
        snackbar,
        loadingBackdrop,
        topLevelInitDone,
        states: {
            loadingState: {val: loadingState, set: setLoadingState},
            tempSelectedSharedItemState: {val: tempSelectedSharedItem, set: setTempSelectedSharedItem}
        }

    })

    const unshareItemController = new UnshareItemController({
        snackbar, sharedItemsController: controller, states: {
            showState: {val: showUnshareItemModal, set: setShowUnshareItemModal}
        }
    })


    useEffect(() => {
        if (!topLevelInitDone) return
        controller.init().then(() => {
            loadingBackdrop(false)
            setInitDone(true)
        })
    }, [topLevelInitDone])

    const viewItems = useMemo(() => {
        return Array.from(sharedItemsMap.values()).sort((a, b) => b.downloads - a.downloads)
    }, [sharedItemsMap])


    return <KartAIBox>

        {showUnshareItemModal && <UnshareItemModal controller={unshareItemController}/>}

        <PageTransitionWrapper>
            <KartAIContainer>
                <ListView>
                    <ListViewHead icon={<Public/>} loading={!initDone} title={StaticText.PUBLIC_DECKS}/>
                    <Divider sx={{color: lightBorderColor, mb: 3}}/>
                    <ListViewContent fullHeight>
                        <KartAIInfoText show={initDone && sharedItemsMap.size === 0}
                                        text={StaticText.NO_PUBLIC_DECKS}
                        />
                        {viewItems.map((sharedItem) => {
                            return <SharedItemsViewItem key={sharedItem.id}
                                                        controller={controller}
                                                        sharedItem={sharedItem}
                                                        onUnshare={() => unshareItemController.open(sharedItem)}
                            />
                        })}
                    </ListViewContent>
                </ListView>
            </KartAIContainer>
        </PageTransitionWrapper>

    </KartAIBox>
}