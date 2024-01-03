import ToggleSelectViewEntityOptions from "../types/ToggleSelectViewEntityOptions";
import store from "../stores/store";
import BaseModel from "../types/dbmodel/BaseModel";
import ViewEntitySelectionControllerOptions from "../types/ViewEntitySelectionControllerOptions";


export default abstract class<T extends BaseModel> {

    private readonly state: ViewEntitySelectionControllerOptions<T>["states"]

    private readonly viewItemsGetter: ViewEntitySelectionControllerOptions<T>["viewItemsGetter"]

    protected constructor(options: ViewEntitySelectionControllerOptions<T>) {
        this.state = options.states
        this.viewItemsGetter = options.viewItemsGetter
    }


    public onToggleSelectViewEntity(options: ToggleSelectViewEntityOptions<T>) {
        const selectedEntities = this.state.selectedEntitiesState.val
        if (selectedEntities.some(e => e.id === options.viewItem.id)) {


            this.state.selectedEntitiesState.set(selectedEntities.filter(e => e.id !== options.viewItem.id))
            if (options.setAsAnchorEl) {
                this.state.selectedEntitiesAnchorElState.set(null)
            }

            if (options.viewItem.id === this.state.selectedEntitiesAnchorElState.val?.id) {
                const items = this.viewItemsGetter()
                const anchorIndex = this.getAnchorIndex(items)

                if (anchorIndex === 0) {
                    this.state.selectedEntitiesAnchorElState.set(null)
                } else {
                    this.state.selectedEntitiesAnchorElState.set(items[anchorIndex - 1])
                }
            }

        } else {
            if (options.singleSelect) {
                this.state.selectedEntitiesState.set([options.viewItem])
            } else {
                this.state.selectedEntitiesState.set([...selectedEntities, options.viewItem])
            }

            if (options.setAsAnchorEl) {
                this.state.selectedEntitiesAnchorElState.set(options.viewItem)
            }
        }
    }

    private getAnchorIndex(viewItems: T[]): number {
        return viewItems.reduce((acc, item, index) => {
            if (item.id === this.state.selectedEntitiesAnchorElState.val?.id) return index
            return acc
        }, -1)
    }

    private getEntityIndex(viewItems: T[], entity: T): number {
        return viewItems.reduce((acc, item, index) => {
            if (item.id === entity.id) return index
            return acc
        }, -1)
    }

    private getMinIndexInSelection(viewItems: T[]): number {
        const indices = []

        for (const item of this.state.selectedEntitiesState.val) {
            indices.push(this.getEntityIndex(viewItems, item))
        }
        return Math.min(...indices)
    }

    private getMaxIndexInSelection(viewItems: T[]): number {
        const indices = []

        for (const item of this.state.selectedEntitiesState.val) {
            indices.push(this.getEntityIndex(viewItems, item))
        }
        return Math.max(...indices)
    }

    public onArrowKeySelection(options: { shiftKey: boolean, up: boolean, viewItems: T[] }) {
        const {viewItems, shiftKey, up} = options

        if (shiftKey && !this.state.selectedEntitiesAnchorElState.val) return
        if (shiftKey) {
            const anchorIndex = this.getAnchorIndex(viewItems)
            if (up) {
                const maxIndexInSelection = this.getMaxIndexInSelection(viewItems)
                console.log({maxIndexInSelection, anchorIndex})
                if (maxIndexInSelection > anchorIndex) {
                    this.scrollToViewEntity(viewItems[maxIndexInSelection])
                    this.onToggleSelectViewEntity({
                        viewItem: viewItems[maxIndexInSelection],
                        setAsAnchorEl: false
                    })
                } else {
                    // maxIndexInSelection <= anchorIndex
                    if (anchorIndex === 0) return
                    const minSelectionIndex = this.getMinIndexInSelection(viewItems)
                    if (minSelectionIndex === 0) return

                    this.scrollToViewEntity(viewItems[minSelectionIndex - 1])
                    this.onToggleSelectViewEntity({
                        viewItem: viewItems[minSelectionIndex - 1],
                    })
                }
            } else {
                const minIndexInSelection = this.getMinIndexInSelection(viewItems)
                if (minIndexInSelection < anchorIndex) {
                    this.scrollToViewEntity(viewItems[minIndexInSelection])
                    this.onToggleSelectViewEntity({
                        viewItem: viewItems[minIndexInSelection],
                    })
                } else {
                    if (anchorIndex === viewItems.length - 1) return
                    const maxSelectionIndex = this.getMaxIndexInSelection(viewItems)
                    if (maxSelectionIndex === viewItems.length - 1) return
                    this.scrollToViewEntity(viewItems[maxSelectionIndex + 1])
                    this.onToggleSelectViewEntity({
                        viewItem: viewItems[maxSelectionIndex + 1],
                    })
                }
            }
        } else {
            const anchorIndex = this.getAnchorIndex(viewItems)
            if (up) {
                if (anchorIndex === 0) return
                this.scrollToViewEntity(viewItems[anchorIndex - 1])
                this.onToggleSelectViewEntity({
                    viewItem: viewItems[anchorIndex - 1],
                    singleSelect: true,
                    setAsAnchorEl: true
                })
            } else {
                if (anchorIndex === viewItems.length - 1) return
                this.scrollToViewEntity(viewItems[anchorIndex + 1])
                this.onToggleSelectViewEntity({
                    viewItem: viewItems[anchorIndex + 1],
                    singleSelect: true,
                    setAsAnchorEl: true
                })
            }
        }
    }


    private scrollToViewEntity = (entity: T) => {
        const el = document.getElementById("row-" + entity.id)
        el?.scrollIntoView()
    }

}