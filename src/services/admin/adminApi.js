import { SplitApiSetting } from "@/services/SplitApiSetting";
import { API_END_POINTS } from "@/services/ApiEndpoints";

export const adminApi = SplitApiSetting.injectEndpoints({
  reducerPath: "adminApi",
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({ url: API_END_POINTS.login, method: "POST", body }),
      invalidatesTags: ["Admin"],
    }),
    me: build.query({
      query: () => ({ url: API_END_POINTS.getUserProfile, method: "GET" }),
      providesTags: ["Admin"],
    }),
    getDashboardStats: build.query({
      query: () => ({
        url: API_END_POINTS.getAdminDashboardStats,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getSystemStatus: build.query({
      query: () => ({
        url: API_END_POINTS.getAdminSystemStatus,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    listUsers: build.query({
      query: () => ({ url: API_END_POINTS.listUsers, method: "GET" }),
      providesTags: ["User"],
    }),
    getUser: build.query({
      query: (id) => ({ url: API_END_POINTS.userDetail(id), method: "GET" }),
      providesTags: (_res, _err, id) => [{ type: "User", id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useMeQuery,
  useGetDashboardStatsQuery,
  useGetSystemStatusQuery,
  useListUsersQuery,
  useGetUserQuery,
} = adminApi;
