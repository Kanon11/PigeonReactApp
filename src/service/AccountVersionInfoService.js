import { postApi, getApi } from './api';

export const IsTestVersion = async (platform, version) => getApi('AppsVersionInfo?platform='+ platform + '&version=' + version, {}, {});
