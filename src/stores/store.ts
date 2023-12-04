import {configureStore} from '@reduxjs/toolkit'
import {enableMapSet} from 'immer';

import {
    decksSlice,
    cardsSlice,
    cardTypesSlice,
    cardTypeVariantsSlice,
    directoriesSlice,
    fieldsSlice,
    fieldContentsSlice,
    sharedItemsSlice
} from "./slices";

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

enableMapSet()

const store = configureStore({
    reducer: {
        decks: decksSlice.reducer,
        cards: cardsSlice.reducer,
        cardTypes: cardTypesSlice.reducer,
        cardTypeVariants: cardTypeVariantsSlice.reducer,
        directories: directoriesSlice.reducer,
        fields: fieldsSlice.reducer,
        fieldContents: fieldContentsSlice.reducer,
        sharedItems: sharedItemsSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})


export default store