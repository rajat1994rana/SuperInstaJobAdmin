import axios from "utils/handleAxios";

export const AdminLogin = ({ email, password }) => {
  return axios.post(`/login`, {
    email,
    password,
  });
};

export const dashBoard = () => {
  return axios.get(`/dashboard`);
};

export const getCategory = ({ page, limit, search }) =>
  axios.get("/categories", { params: { page, limit, search } });

export const getCoupons = ({ page, limit, search }) =>
  axios.get("/coupons", { params: { page, limit, search } });

export const getReportUsers = ({ page, limit, search }) =>
  axios.get("/report-users", { page, limit, search });

export const getReportUsersDetails = ({ page, limit, userId }) =>
  axios.get(`/report-users/${userId}`, { page, limit });

export const getAllTags = (params) => axios.get("/tags", { params });
export const addNewTag = (data) => axios.post("/tags", data);
export const updateTag = (data) => axios.put("/tags", data);

export const addNewCoupon = (data) => {
  const form = new FormData();
  form.append("title", data.title);
  form.append("percentage", data.percentage);
  form.append("couponUseLimit", data.couponUseLimit);
  form.append("code", data.code);
  form.append("image", data.image);
  form.append("status", 1);
  return axios.post("/coupons", form);
};

export const blackListClient = (data) => {
  const form = new FormData();
  form.append("reportUserId", data.userId);
  form.append("reasonType", data.reasonType);
  form.append("description", data.description);
  form.append("image", data.image);
  return axios.post("/black-list", form);
};

export const updateCoupon = (data) => {
  const form = new FormData();
  form.append("title", data.title);
  form.append("id", data.id);
  form.append("percentage", data.percentage);
  form.append("couponUseLimit", data.couponUseLimit);
  form.append("code", data.code);
  form.append("image", data.image);
  form.append("status", 1);
  return axios.put("/coupons", form);
};

export const getSubCategory = ({ page, limit, search, categoryId }) =>
  axios.get("/sub-categories", { params: { page, limit, search, categoryId } });

export const setCategoryPosition = () => axios.get("/categories");

export const users = ({ page = 1, limit = 10, search, status, userType }) => {
  return axios.get("/users", {
    params: {
      page,
      limit,
      search,
      status,
      userType,
    },
  });
};

export const BookingListData = (
  page = 1,
  limit = 10,
  q = "",
  status = "",
  filter
) => {
  return axios.get("/bookings", {
    params: {
      page,
      limit,
      q,
      status,
      ...filter,
    },
  });
};

export const instructorsList = (
  page = 1,
  limit = 10,
  q = "",
  status = "",
  filters
) => {
  return axios.get("/provider", {
    params: {
      page,
      limit,
      q,
      status,
      ...filters,
    },
  });
};

export const getWalletTransaction = ({ userId, page = 1, limit = 10 }) =>
  axios.get(`/wallet-transaction/${userId}`, {
    params: {
      page,
      limit,
    },
  });

export const appInfo = () => {
  return axios.get(`/app-info`);
};

export const getUserProof = (userId) => axios.get(`/user-proof/${userId}`);

export const allCategories = (page = 1, limit = 1000, q = "") => {
  return axios.get(`/all-services`, {
    params: {
      page,
      limit,
      q,
    },
  });
};
export const updateAppInfo = (data) => {
  return axios.put(`/app-info`, data);
};

export const redeemUserAmount = (data) => {
  return axios.put(`/redeem-amount`, data);
};

export const addCategory = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("image", data.image);
  form.append("status", 1);
  return axios.post(`/add-categories`, form);
};

export const addSubCategory = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("image", data.image);
  form.append("categoryId", data.categoryId);
  form.append("status", 1);
  return axios.post(`/add-subcategory`, form);
};

export const editSubCategory = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("image", data.image);
  form.append("categoryId", data.categoryId);
  form.append("id", data.id);
  return axios.put("/edit-subcategory", form);
};

export const editCategory = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("image", data.image);
  form.append("id", data.id);
  return axios.put("/update-categories", form);
};

export const addUser = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("email", data.email);
  form.append("password", data.password);
  form.append("profile", data.profile);
  form.append("phone", data.phone);
  form.append("userType", 0);
  form.append("status", 1);
  return axios.post(`/users`, form);
};

export const addFreelancerInfo = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("email", data.email);
  form.append("password", data.password);
  form.append("profile", data.profile);
  form.append("phone", data.phone);
  form.append("userTypes", 1);
  form.append("status", 1);
  return axios.post(`/users`, form);
};

export const getUserInfo = (id) => {
  return axios.get(`/user-info/${id}`);
};
export const getProviderInfo = (id) => {
  return axios.get(`/provider-info/${id}`);
};
export const updateDocumentStatus = ({ status, userId }) =>
  axios.put("/update-document", { userId, status });

export const getAppSettings = () => axios.get("/app-settings");
export const getWithDrawRequest = (page = 1, limit = 10, q = "", status) =>
  axios.get("/withdraw-request", {
    params: {
      page,
      limit,
      q,
      status,
    },
  });

export const editUserData = (data) => {
  const form = new FormData();
  form.append("id", data.id);
  form.append("name", data.name);
  form.append("email", data.email);
  form.append("password", data.password);
  form.append("profile", data.profile);
  form.append("phone", data.phone);
  return axios.put(`/users`, form);
};

export const updateProfile = (data) => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("password", data.password);
  form.append("email", data.email);
  form.append("profile", data.image);
  form.append("id", data.id);
  return axios.put(`/admin-profile`, form);
};

export const updateUser = (data) => {
  return axios.put(`/users`, data);
};
export const addUserPoints = (data) => {
  return axios.post(`/add-user-point`, data);
};

export const updateAllStatus = (data) => {
  return axios.put(`/update-status`, data);
};
export const sendPush = (data) => {
  return axios.put(`/send-push`, data);
};
export const updateSetting = (data) => {
  return axios.put(`/app-settings/${data.id}`, data);
};
export const cancelSubscription = (data) => {
  return axios.post(`/cancel-subscription`, data);
};

export const deleteUser = (data) => {
  return axios.delete(
    "/remove-records",
    { data },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};

export const cancelBooking = (data) => axios.patch("/cancel-booking", data);
