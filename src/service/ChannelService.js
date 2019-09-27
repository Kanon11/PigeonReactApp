import { postApi,getApi, postApiFormData, postApiFormDataForPDF } from "./api";

export const GetChannelByInstitute = async (instituteId) => postApi("channel?instituteId=" + instituteId, {}, {});
export const GetChannelDetail = async (channelId) => getApi("channel?ChannelId=" + channelId, {}, {});
export const GetChannelSubscribers = async (channelId) => getApi("ChannelSubscribe/subscribers/" + channelId, {});
export const GetPendingInvitations = async (channelId) => getApi("Invitation/pendinginvitations?channelId=" + channelId, {});
export const GetSubscribeAndOwnChannel = async () => getApi("Institute/SubscribedAndOwnInstitute", {}, {});
export const GetNonSubscribeAndNotOwnChannelByUser = async (channelId) => postApi("channel/subscribe?includeOwnChannel=true", {}, {});

export const SaveChannel = async (data) => postApi("channel/save", {}, data);
export const SendInvitation = async (data) => postApi("Invitation", {}, data);
export const GetChannelList = async () => getApi("channel/SubscribeAndOwnChannel", {}, {});
export const SubscribeUnSubscribeChannel = async (channelId) => postApi("channelSubscribe/subscribeChannel/" + channelId, {});
export const SubscribeChannel = async (channelId) => postApi("channelSubscribe/subscribe/" + channelId ,{});
export const ResendInvitation = async (invitationId) => getApi("Invitation/InvitationResend?invitationId=" + invitationId, {});
export const CancelInvitation = async (invitationId) => getApi("Invitation/InvitationCancel?invitationId=" + invitationId, {});
export const UnSubscribeChannel = async (channelId) => postApi("channelSubscribe/unsubscribe/" + channelId, {});
export const UnSubscribeChannelByUserId = async (channelId, userId) => postApi("ChannelSubscribe/unsubscribeByUserId?channelId=" + channelId + "&userId=" + userId, {}, {});
export const AddChannelOwner = async (channelId, userId) => postApi("ChannelOwner/AddOwner/" + channelId + "/" + userId);
export const RemoveChannelOwner = async (channelOwnerId) => postApi("ChannelOwner/RemoveOwner/" + channelOwnerId);
export const GetChannelAdmins = async (channelId) => getApi("ChannelOwner/channeladmins/" + channelId);
export const GetChannelNotice = async (channelId) => getApi("Notice?ChannelId=" + channelId, {});
export const GetChannelCategory = async (channelId) => getApi("Channel/ChannelCategories" ,{}, {});
export const PostTextNotice = async (data) => postApi("Notice/PostTextNotice" ,{},data);
export const PostImageNotice = async (keyValue, uri, fileType, fileName, channelId, isVotingEnabled, votingLastDate) => postApiFormData(`Notice/media/channel/${channelId}/${isVotingEnabled}?votingLastDate=${votingLastDate}` ,{},keyValue, uri, fileType, fileName);
export const PostPdfNotice = async (keyValue, uri, fileType, fileName, channelId, isVotingEnabled, votingLastDate) => postApiFormDataForPDF(`Notice/media/channel/${channelId}/${isVotingEnabled}?votingLastDate=${votingLastDate}` ,{},keyValue, uri, fileType, fileName);
export const PostAndGetBlob = async (keyValue, uri, fileType, fileName) => postApiFormData('Channel/PostAndGetBlob', {}, keyValue, uri, fileType, fileName);

