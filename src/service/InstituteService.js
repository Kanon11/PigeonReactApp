import { postApi, getApi } from "./api";

export const GetInstituteCategories = async () => getApi("institute/InstituteCategories", {}, {});
export const GetInstituteTypes = async () => getApi("institute/InstituteTypes", {}, {});
export const GetInstituteDetail = async (instituteId) => getApi("institute?instituteId=" + instituteId, {}, {});
export const GetSubscribeAndOwnInstituteByUser = async () => getApi("institute/SubscribedAndOwnInstituteList", {}, {});

export const SubscribeInstitute = async (instituteId) => postApi('InstituteSubscribe/subscribeInstitute/' + instituteId ,{});
export const SaveInstitute = async (data ) => postApi("institute/SaveInstitute", {}, data);

export const GetMineInstitute = async ()=> getApi("institute/SubscribedAndOwnInstitute",{},{})
export const GetInstituteType = async () => getApi("Institute/InstituteTypes", {}, {});
export const GetOwnInstitute = async () => getApi("Institute/GetOwnInstitute", {}, {});
export const GetInstituteCategory = async () => getApi("Institute/InstituteCategories", {}, {});
export const GetInstituteById = async (instituteId) => getApi(`Institute/GetInstituteList?instituteId=${instituteId}`,{}, {});
export const GetChannelByInstituteId = async (InstituteId) => getApi('Channel?InstituteId='+InstituteId,{});