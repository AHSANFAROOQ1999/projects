import { createSlice } from "@reduxjs/toolkit";

export const productPageSlice = createSlice({
  name: "productPageSlice",
  initialState: {
    productId: null,
    productHandle: null,
    productis_reveiw: false,
  },
  reducers: {
    productReducer: (state, action) => {
      state.productId = action?.payload?.id;
      state.productHandle = action?.payload?.handle;
      state.productis_reveiw = action?.payload?.is_review;
    },
    productReviewd: (state, action) => {
      debugger;
      state.productis_reveiw = action?.payload;
    },
  },
});

export const { productReducer, productReviewd } = productPageSlice.actions;
export default productPageSlice.reducer;
