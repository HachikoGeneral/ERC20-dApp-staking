import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stakingContract: undefined,
  myTokenContract: undefined,
  loading: false,
};

export const blockchainSlice = createSlice({
  name: "blockchainSlice",
  initialState,
  reducers: {
    CONTRACTS_REQUEST: (state) => {
      state.loading = true;
    },
    CONTRACTS_SUCCESSFUL: (state, action) => {
      state.loading = false;
      state.stakingContract = action.payload.stake;
      state.myTokenContract = action.payload.token;
    },
  },
});

export const { CONTRACTS_REQUEST, CONTRACTS_SUCCESSFUL } =
  blockchainSlice.actions;

export default blockchainSlice.reducer;
