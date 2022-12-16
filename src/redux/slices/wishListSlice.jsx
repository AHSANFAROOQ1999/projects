import { createSlice } from "@reduxjs/toolkit";

export const wishListSlice = createSlice({
  name: "wishList",
  initialState: {
    wishList: [],
  },
  reducers: {
    addToWishList: (state, action) => {},
  },
});

export const { addToWishList } = wishListSlice.actions;
export default wishListSlice.reducer;
