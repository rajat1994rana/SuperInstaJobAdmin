import axios from "utils/handleAxios";
export const getLastChatList = () => {
  return axios.get("/last-chat");
};
export const getAllMessage = (id) => {
  return axios.get(`/messages/${id}`);
};
export const sendMessageInThread = (body) => {
  return axios.post(`/send-message/${body.threadId}`, body);
};
