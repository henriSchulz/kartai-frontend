import Deck from "../types/dbmodel/Deck";
import store from "../stores/store";
import Directory from "../types/dbmodel/Directory";
import DeckUtils from "./DeckUtils";
import EntityUtils from "./abstract/EntityUtils";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {directoriesSlice} from "../stores/slices";
import EntityUtilsFuncOptions from "../types/EntityUtilsFuncOptions";
import CardUtils from "./CardUtils";
import {ID_PROPERTIES} from "./general";


export default class DirectoryUtils extends EntityUtils<Directory> {

    constructor() {
        const storeSchema: OmittedStoreSchema<Directory> = {
            name: {type: "string", limit: 100},
            parentId: {type: "string", limit: ID_PROPERTIES.length, reference: "directories", nullable: true},
            isShared: {type: "number", limit: 1}
        }

        super("directories", storeSchema, 1000, () => store.getState().directories.value, directoriesSlice)
    }

    static instance: DirectoryUtils

    static getInstance(): DirectoryUtils {
        if (this.instance === undefined) {
            this.instance = new DirectoryUtils()
        }

        return this.instance
    }


    public getSubDecks(directoryId: string): Deck[] {
        const decks: Deck[] = DeckUtils.getInstance().getDecksByParentId(directoryId)

        for (const subDirectory of this.getSubDirectories(directoryId)) {
            decks.push(...DeckUtils.getInstance().getDecksByParentId(subDirectory.id))
        }
        return decks
    }

    public getSubDirectories(directoryId: string): Directory[] {
        const dirs: Directory[] = []

        const collectSubDirectories = (parentId: string) => {
            for (const dir of this.toArray()) {
                if (dir.parentId === parentId) {
                    dirs.push(dir);
                    collectSubDirectories(dir.id);
                }
            }
        };

        collectSubDirectories(directoryId);

        return dirs
    }

    public getParentDirectoriesPath(directoryId?: string | null, includeCurrentDir: boolean = false): Directory[] {
        if (!directoryId) return []
        try {
            let dir: Directory = this.getById(directoryId)
            let currentDirId = dir.parentId
            const path: Directory[] = []

            if (includeCurrentDir) {
                path.push(dir)
            }

            while (true) {
                if (!currentDirId) return path.reverse()
                const parentDir = this.getById(currentDirId)
                path.push(parentDir)
                currentDirId = parentDir.parentId
            }

            return path
        } catch (e) {
            return []
        }
    }

    public getPathString(directoryId?: string | null, includeCurrentDir: boolean = false): string {
        if (!directoryId) return "/"
        const path = this.getParentDirectoriesPath(directoryId, includeCurrentDir)

        if (path.length === 0) return "/"
        return "/" + path.map(dir => dir.name).join("/")
    }


    async delete(ids: string | string[], options: EntityUtilsFuncOptions = {local: true, api: true}): Promise<void> {

        CardUtils.getInstance().deleteByDirectoryId(ids)
        DeckUtils.getInstance().deleteBy("parentId", ids, {local: true, api: false})

        return super.delete(ids, options);
    }
}