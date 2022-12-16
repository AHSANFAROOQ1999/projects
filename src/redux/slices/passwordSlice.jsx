import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const passwordSlice = createSlice({
  name: "storefrontPassword",
  initialState: {
    passwordChecked: false,
    passwordEnable: false,
    passwordMatch: false,
  },
  reducers: {
    setPasswordEnable: (state, action) => {
      //debugger
      // console.log('setPasswordEnable: ', action.payload)
      state.passwordEnable = action.payload;
      state.passwordChecked = true;
    },
    setPasswordMatch: (state, action) => {
      // debugger
      //console.log('setPasswordMatch: ', action.payload)
      state.passwordMatch = action.payload;
    },

    // extraReducers: (builder) => {
    //   builder.addCase(checkPassword.fulfilled, (state, action) => {
    //     state.passwordChecked = true
    //     state.passwordEnabled = action.payload
    //   })
    //   builder.addCase(checkPassword.rejected, (state, action) => {
    //     debugger
    //     console.log('RejectedAction', action)
    //     state.passwordChecked = sessionStorage.getItem('passwordMatched', true)
    //     state.passwordEnabled = action.payload
    //   })
    // },
  },
});

// Async Thunks!

export const checkPasswordProtect = createAsyncThunk(
  "/storefront/check_protect_password",
  async () => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_HOST + "/storefront/check_protect_password"
    );

    const jsonResponse = await response.json();
    //console.log('AsyncThunk JSON Response: ', jsonResponse)

    //console.log('jsonResponse.enable_password', jsonResponse.enable_password)

    if (jsonResponse.enable_password === true) {
      //debugger
      sessionStorage.setItem("passwordEnable", jsonResponse.enable_password);
      localStorage.setItem("Seo_title", jsonResponse?.seo_title);
      localStorage.setItem("Seo_description", jsonResponse?.seo_description);
      localStorage.setItem("Seo_keyword", jsonResponse?.seo_keywords);
      //window.location.reload()

      return jsonResponse;
    }

    return jsonResponse;
  }
);

export const { setPasswordEnable, setPasswordMatch } = passwordSlice.actions;
export default passwordSlice.reducer;
