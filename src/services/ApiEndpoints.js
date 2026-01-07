// Build absolute URLs only for production; in dev we rely on baseUrl '/api' via Vite proxy
// export const BASE_URL = "http://192.168.18.31:5000/api";
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://gb.senew-tech.com/api";

export const BASE_URL_IMAGE = import.meta.env.VITE_FILES_URL || "";

// Endpoints are path-only so baseUrl from SplitApiSetting applies cleanly
export const API_END_POINTS = {
  // AUTH
  login: BASE_URL + "/users/login",
  forgetPassword: BASE_URL + "/auth/forgot-password",
  resetPassword: BASE_URL + "/auth/reset-password",
  updateUserProfile: BASE_URL + "/auth/profile",
  getUserProfile: BASE_URL + "/auth/profile",

  // ADMIN DASHBOARD
  getAdminDashboardStats: BASE_URL + "/matches/stats/dashboard",
  getAdminSystemStatus: BASE_URL + "/admin/system-status",

  // USERS (examples)
  listUsers: BASE_URL + "/admin/users",
  userDetail: (id) => BASE_URL + `/admin/users/${id}`,

  // FOOTBALL
  getTodayFixtures: BASE_URL + "/football/today-fixtures",
  getTomorrowFixtures: BASE_URL + "/football/tomorrow-fixtures",
  getTodayFixturesActive: BASE_URL + "/football/today-fixtures-active",
  getTomorrowFixturesActive: BASE_URL + "/football/tomorrow-fixtures-active",
  getLeagues: BASE_URL + "/leagues",
  getLeaguesStatus: BASE_URL + "/leagues/status",
  getActiveLeagues: BASE_URL + "/leagues/active",
  updateLeagueStatus: (leagueId) =>
    BASE_URL + `/leagues/${leagueId}/toggle-active`,

  getSimulationStats: BASE_URL + "/match-predictions/stats/summary",
  getPredictionsByDate: BASE_URL + "/predictions",

  // double or nothing
  getDoubleOrNothingMatches: BASE_URL + "/admin/matches/double-or-nothing",

  // MATCH MANAGEMENT
  getMatches: BASE_URL + "/matches",
  getFeaturedMatches: BASE_URL + "/matches/featured",
  featuredMatch: BASE_URL + `/matches`,
  getAiPickedWinner: BASE_URL + `/matches/ai-picks?page=1&limit=10`,
  addAiPickedWinner: BASE_URL + `/matches/`,
  deleteAiPickedWinner: BASE_URL + `/matches/`,
  getPlayOfTheDay: BASE_URL + `/matches/play-of-day?page=1&limit=10`,
  addPlayOfTheDay: BASE_URL + `/matches/`,
  deletePlayOfTheDay: BASE_URL + `/matches/`,
  getLiveMatches: BASE_URL + `/admin/matches/markedasshowonhomepage`,
  getTomorrowMatches: BASE_URL + `/admin/matches/tomorrow`,
  getHomepageScores: BASE_URL + `/matches/homepage/scores`,

  // Home Page Match
  updateHomePageMatches: BASE_URL + `/admin/matches`,
  updatePrediction: BASE_URL + `/match-predictions/update/`,

  // LEAGUE MANAGEMENT
  getLeagues: BASE_URL + "/leagues",
  activeLeagues: BASE_URL + "/leagues/",
  deactivateLeagues: BASE_URL + "/leagues/",

  // COUNTRY AND LEAGUE FILTERING
  getCountries: BASE_URL + "/matches/countries",
  getLeaguesByCountry: BASE_URL + "/matches/leagues",
};
