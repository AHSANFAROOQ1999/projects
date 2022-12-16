import { createSlice } from "@reduxjs/toolkit";

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkoutId: "",
    checkoutObj: {},
    showMainComps: true,
  },
  reducers: {
    setCheckoutId: (state, action) => {
      state.checkoutId = action.payload;
    },
    setCheckout: (state, action) => {
      state.checkoutObj = action.payload;
    },
    setShowMainComps: (state, action) => {
      state.showMainComps = action.payload;
    },
    clearCheckout: (state, action) => {
      // debugger;
      state.checkoutObj = {};
      state.checkoutId = "";
      localStorage.removeItem("checkout_id");
      localStorage.removeItem("billingAddress");
      localStorage.removeItem("shippingAddress");
    },
  },
});

export const { setCheckoutId, setCheckout, setShowMainComps, clearCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
