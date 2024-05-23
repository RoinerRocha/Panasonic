import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {}
})