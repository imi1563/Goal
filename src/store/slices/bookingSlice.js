import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    clear: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, clear } = bookingSlice.actions;
export default bookingSlice.reducer;
