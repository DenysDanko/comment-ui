export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_ENDPOINTS = {
  captcha: `${API_BASE_URL}/api/captcha`,
  comments: `${API_BASE_URL}/api/comments`,
  hub: `${API_BASE_URL}/commentHub`
};
