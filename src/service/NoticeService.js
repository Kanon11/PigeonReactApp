import { postApi, getApi } from "./api";

export const SaveTextNotice = async data => postApi("notice", {}, data);
export const GetChannelNoticeFeed = async channelId =>
  getApi("notice?channelId=" + channelId+'&UpdateView=true', {}, {});
export const GetCommonNoticeFeed = async (feedTypeId,tags) =>
  postApi("NoticeFeed/GetNoticeFeed?jsonString=" + JSON.stringify({FeedTypeId:feedTypeId}) + '&tags=' + tags  , {}, {});
export const saveNotice = async (noticeId) => getApi("NoticeFeed/noticesaved/" + noticeId ,{});
export const unsaveNotice = async (noticeId) => getApi("NoticeFeed/noticeunsaved/" + noticeId ,{});
export const likeNotice = async (noticeId) => getApi("NoticeFeed/noticelike/" + noticeId ,{});
export const unlikeNotice = async (noticeId) => getApi("NoticeFeed/noticeunlike/" + noticeId ,{});
export const shareNotice = async (noticeId, shareToEmail) =>getApi('NoticeFeed/noticeshare/' + noticeId + '/' +shareToEmail);
export const deleteNotice = async (noticeId) => getApi("NoticeFeed/delete/" + noticeId ,{});
export const getEmailList = async (noticeId) => getApi("NoticeFeed/shareduserlist/" + noticeId ,{});
export const castChannelVote = async (noticeID,voteType) =>
  postApi("notice/" + noticeID + '/voting/' + voteType  , {}, {});
  export const voteResult = async (noticeID) =>
  getApi("notice/" + noticeID + '/voting/result/' , {}, {});