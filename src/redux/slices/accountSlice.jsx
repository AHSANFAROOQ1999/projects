import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    loggedIn: sessionStorage.getItem("comverse_customer_token") ? true : false,
    logOut: sessionStorage.getItem("comverse_customer_token") ? false : true,
    comverse_customer_id: null,
    comverse_customer_email: null,
    comverse_customer_token: null,
  },
  reducers: {
    loginReducer: (state, action) => {
      sessionStorage.setItem("comverse_customer_id", action.payload.data.id);
      state.comverse_customer_id = action.payload.data.id;

      sessionStorage.setItem(
        "comverse_customer_token",
        action.payload.data.token
      );
      state.comverse_customer_token = action.payload.data.token;

      sessionStorage.setItem(
        "comverse_customer_email",
        action.payload.data.email
      );
      state.comverse_customer_email = action.payload.data.email;

      state.loggedIn = true;
      state.logOut = false;
    },
    logoutReducer: (state) => {
      // debugger;
      sessionStorage.removeItem("comverse_customer_id");
      sessionStorage.removeItem("comverse_customer_token");
      sessionStorage.removeItem("comverse_customer_email");
      localStorage.removeItem("wishList");

      state.loggedIn = false;
      state.logOut = true;
      state.comverse_customer_id = null;
      state.comverse_customer_email = null;
      state.comverse_customer_token = null;
    },
  },
});

export const { loginReducer, logoutReducer } = accountSlice.actions;
export default accountSlice.reducer;
