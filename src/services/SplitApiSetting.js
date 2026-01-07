import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "@/store/slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  // Force /api in development to fix toggle issue
  baseUrl: import.meta.env.DEV ? "/api" : "http://gb.workbrink.com/api",
  prepareHeaders: async (headers, { getState }) => {
    try {
      const token =
        getState()?.auth?.user?.token || localStorage.getItem("token");
      headers.set("Content-Type", "application/json");
      headers.set("accept", "application/json");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      } else {
        // Do not send an empty Authorization header; some servers treat it as auth attempt and return 401
        headers.delete("authorization");
      }
    } catch (e) {
      headers.delete("authorization");
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const SplitApiSetting = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [],
});
