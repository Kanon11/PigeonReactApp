import { postApi, deleteApi, getApi } from "./api";

export const CreateAccount = async data =>
  postApi("account/CreateAccount", {}, data);
export const Login = async data => postApi("account/token", {}, data);
export const VerifyEmail = async email =>
  postApi("account/VerifyEmail/" + email, {}, {});
export const VerifyCurrentPassword = async password =>
  postApi("account/VerifyCurrentPassword/" + password, {}, {});
export const ResetPassword = async (email, password) =>
  postApi("account/ResetPassword/" + email + "/" + password, {}, {});
  export const SendOTP = async (userName) => postApi("account/SendOTP/" + userName ,{});
export const ChangePassword = async (userName, currentPassword, newPassword) =>
  postApi(
    "account/ChangePassword/" +
      userName +
      "/" +
      currentPassword +
      "/" +
      newPassword,
    {},
    {},
    {}
  );
export const AddDeviceToken = async deviceToken =>
  postApi("account/DeviceToken/" + deviceToken, null, null);

  export const RemoveDeviceToken = async deviceToken =>
  deleteApi("account/DeviceToken/" + deviceToken, null, null);