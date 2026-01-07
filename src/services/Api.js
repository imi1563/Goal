import { SplitApiSetting } from "@/services/SplitApiSetting";
import { API_END_POINTS } from "@/services/ApiEndpoints";

export const api = SplitApiSetting.injectEndpoints({
  reducerPath: "api",
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    /////////////////////////////<===MUTATIONS===>//////////////////////////////
    forgetPassword: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.forgetPassword,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.resetPassword,
        method: "POST",
        body: data,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.updateUserProfile,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "UpdateUserList", id: "user" }],
    }),

    /////////////////////////////<===QUERIES===>////////////////////////////////
    getUserProfile: builder.query({
      query: () => ({ url: API_END_POINTS.getUserProfile, method: "GET" }),
      providesTags: [{ type: "UpdateUserList", id: "user" }],
    }),

    // Football: Today Fixtures
    getTodayFixtures: builder.query({
      query: () => ({ url: API_END_POINTS.getTodayFixtures, method: "GET" }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw today fixtures response:", response);
        return response?.fixtures || response || [];
      },
      providesTags: ["TodayFixtures"],
    }),

    // Football: Today Fixtures (Active Leagues Only)
    getTodayFixturesActive: builder.query({
      query: () => ({
        url: API_END_POINTS.getTodayFixturesActive,
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log(
          "[API DEBUG] Raw today fixtures active response:",
          response
        );
        return response?.fixtures || response || [];
      },
      providesTags: ["TodayFixturesActive"],
    }),

    // Football: Tomorrow Fixtures (Active Leagues Only)
    getTomorrowFixturesActive: builder.query({
      query: () => ({
        url: API_END_POINTS.getTomorrowFixturesActive,
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log(
          "[API DEBUG] Raw tomorrow fixtures active response:",
          response
        );
        return response?.fixtures || response || [];
      },
      providesTags: ["TomorrowFixturesActive"],
    }),

    // Get Active Leagues (Public)
    getActiveLeagues: builder.query({
      query: () => ({ url: API_END_POINTS.getActiveLeagues, method: "GET" }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw active leagues response:", response);
        return response?.data || [];
      },
      providesTags: ["ActiveLeagues"],
    }),

    // Update League Status
    updateLeagueStatus: builder.mutation({
      query: ({ leagueId, isActive }) => ({
        url: API_END_POINTS.updateLeagueStatus(leagueId),
        method: "PATCH",
        body: { isActive },
      }),
    }),

    // Get Leagues
    getLeagues: builder.query({
      query: () => ({ url: API_END_POINTS.getLeagues, method: "GET" }),
      providesTags: ["Leagues"],
    }),

    // Get Leagues Status (Active/Inactive)
    getLeaguesStatus: builder.query({
      query: () => ({ url: API_END_POINTS.getLeaguesStatus, method: "GET" }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw leagues status response:", response);
        return response?.data || [];
      },
      providesTags: ["LeaguesStatus"],
    }),

    // Football: Tomorrow Fixtures
    getTomorrowFixtures: builder.query({
      query: () => ({ url: API_END_POINTS.getTomorrowFixtures, method: "GET" }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw tomorrow fixtures response:", response);
        return response?.fixtures || response || [];
      },
      providesTags: ["TomorrowFixtures"],
    }),

    // Dashboard: Simulation Stats
    getSimulationStats: builder.query({
      query: () => ({ url: API_END_POINTS.getSimulationStats, method: "GET" }),
      transformResponse: (res) => res, // Return the array as-is
      providesTags: ["SimulationStats"],
    }),

    // Predictions by date (flat list with fixture + prediction)
    getPredictionsByDate: builder.query({
      query: (date) => ({
        url: `${API_END_POINTS.getPredictionsByDate}?date=${date}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.rows || [],
      providesTags: ["PredictionsByDate"],
    }),

    // Matches
    getMatches: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getMatches}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,

      }),
      providesTags: ["Matches"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),



    getDoubleOrNothingMatches: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getDoubleOrNothingMatches}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Matches"],
    }),

    updateHomePageMatches: builder.mutation({
      query: (id) => ({
        url: `${API_END_POINTS.updateHomePageMatches}/${id}/homepage`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matches"],
    }),

    updateDoubleOrNothingMatches: builder.mutation({
      query: ({ id, data }) => ({
        url: `${API_END_POINTS.updateHomePageMatches}/${id}/double-or-nothing`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Matches"],
    }),

    updatePrediction: builder.mutation({
      query: ({ id, data }) => ({
        url: `${API_END_POINTS.updatePrediction}${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Matches"],
    }),


    deleteMatch: builder.mutation({
      query: (id) => ({
        url: `${API_END_POINTS.getMatches}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Matches"],
    }),

    // AI Picked Winner
    getAiPickedWinner: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getAiPickedWinner}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Matches"],
    }),


    addAiPickedWinner: builder.mutation({
      query: (id) => ({
        url: `${API_END_POINTS.addAiPickedWinner}/${id}/ai-pick`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matches"],
    }),


    deleteAiPickedWinner: builder.mutation({
      query: (id) => ({
        url: `${API_END_POINTS.deleteAiPickedWinner}/${id}/ai-pick`,
        method: "DELETE",
      }),
      invalidatesTags: ["Matches"],
    }),

    // AI Picked Winner
    getPlayOfTheDay: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getPlayOfTheDay}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Matches"],
    }),


    addPlayOfTheDay: builder.mutation({
      query: (id) => ({
        url: `${API_END_POINTS.addPlayOfTheDay}/${id}/play-of-day`,
        method: "PATCH",
      }),
      invalidatesTags: ["Matches"],
    }),


    deletePlayOfTheDay: builder.mutation({
      query: (id) => ({
        url: `${API_END_POINTS.deletePlayOfTheDay}/${id}/play-of-day`,
        method: "DELETE",
      }),
      invalidatesTags: ["Matches"],
    }),

    // Live Matches
    getLiveMatches: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getLiveMatches}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Matches"],
    }),
    // Live Matches
    getTomorrowMatches: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getTomorrowMatches}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Matches"],
    }),

    // Homepage Scores
    getHomepageScores: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getHomepageScores}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw homepage scores response:", response);
        return response?.data || response || [];
      },
      providesTags: ["HomepageScores"],
    }),

    getFeaturedMatches: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getFeaturedMatches}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Matches"],
    }),

    featuredMatch: builder.mutation({
      query: ({ data, matchId }) => ({
        url: `${API_END_POINTS.featuredMatch}/${matchId}/featured`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Matches"],
    }),

    // Leagues
    getLeaguesAdmin: builder.query({
      query: (params) => ({
        url: `${API_END_POINTS.getLeagues}`,
        method: "GET",
        params: params && Object.keys(params).length > 0 ? params : undefined,
      }),
      providesTags: ["Leagues"],
    }),

    activeLeagues: builder.mutation({
      query: (leagueId) => ({
        url: `${API_END_POINTS.activeLeagues}${leagueId}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Leagues"],
    }),

    deactivateLeagues: builder.mutation({
      query: (leagueId) => ({
        url: `${API_END_POINTS.deactivateLeagues}${leagueId}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Leagues"],
    }),

    // Admin Dashboard Stats
    getAdminDashboardStats: builder.query({
      query: () => ({
        url: API_END_POINTS.getAdminDashboardStats,
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log(
          "[API DEBUG] Raw admin dashboard stats response:",
          response
        );
        return response?.data || {};
      },
      providesTags: ["AdminDashboardStats", "Leagues"],
    }),

    // Countries and Leagues for filtering
    getCountries: builder.query({
      query: () => ({
        url: API_END_POINTS.getCountries,
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw countries response:", response);
        return response?.data?.countries || [];
      },
      providesTags: ["Countries"],
    }),

    getLeaguesByCountry: builder.query({
      query: ({ country, league }) => ({
        url: API_END_POINTS.getLeaguesByCountry,
        method: "GET",
        params: { country, league },
        enabled: !!country || !!league,
      }),
      transformResponse: (response) => {
        console.log("[API DEBUG] Raw leagues by country response:", response);
        return response?.data?.leagues || [];
      },
      providesTags: ["LeaguesByCountry"],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }),
  }),
  overrideExisting: true,
});

export const {
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserProfileMutation,
  useUpdateLeagueStatusMutation,

  useGetUserProfileQuery,
  useGetTodayFixturesQuery,
  useGetTomorrowFixturesQuery,
  useGetTodayFixturesActiveQuery,
  useGetTomorrowFixturesActiveQuery,
  useGetActiveLeaguesQuery,
  useGetLeaguesQuery,
  useGetLeaguesStatusQuery,
  useGetSimulationStatsQuery,
  useGetPredictionsByDateQuery,

  useGetMatchesQuery,
  useUpdateHomePageMatchesMutation,
  useUpdateDoubleOrNothingMatchesMutation,
  useUpdatePredictionMutation,
  useGetLiveMatchesQuery,
  useGetTomorrowMatchesQuery,
  useDeleteMatchMutation,

  useGetPlayOfTheDayQuery,
  useAddPlayOfTheDayMutation,
  useDeletePlayOfTheDayMutation,

  useAddAiPickedWinnerMutation,
  useDeleteAiPickedWinnerMutation,
  useGetAiPickedWinnerQuery,

  useGetFeaturedMatchesQuery,
  useFeaturedMatchMutation,

  useGetLeaguesAdminQuery,
  useActiveLeaguesMutation,
  useDeactivateLeaguesMutation,

  useGetDoubleOrNothingMatchesQuery,

  useGetHomepageScoresQuery,

  useGetAdminDashboardStatsQuery,

  useGetCountriesQuery,
  useGetLeaguesByCountryQuery,
} = api;
