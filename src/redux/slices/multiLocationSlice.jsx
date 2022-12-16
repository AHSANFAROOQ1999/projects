import { createSlice } from "@reduxjs/toolkit";

export const currencySlice = createSlice({
  name: "multiLocation",
  initialState: {
    defaultCountryCode: "",
    defaultCountry: "",
    defaultCurrency: "",
  },
  reducers: {
    setDefaultCountry: (state, action) => {
      // debugger;
      state.defaultCountry = action.payload.country_name;
      state.defaultCountryCode = action.payload.short_code;
      state.defaultCurrency = action.payload.currency;
    },
    changeCountryCode: (state, action) => {
      // debugger;
      state.defaultCountryCode = action.payload;
    },
    changeCountry: (state, action) => {
      // debugger;
      state.defaultCountry = action.payload;
      localStorage.removeItem("cart");
      localStorage.removeItem("wishList");
    },
    changeCurrency: (state, action) => {
      // debugger;
      state.defaultCurrency = action.payload;
    },
  },
});

export const {
  setDefaultCountry,
  changeCountryCode,
  changeCountry,
  changeCurrency,
} = currencySlice.actions;
export default currencySlice.reducer;
