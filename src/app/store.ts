import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import whitelistDataReducer from "../slices/whitelistDataSlice"

export const store = configureStore({
  reducer: {
    whitelistData: whitelistDataReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
