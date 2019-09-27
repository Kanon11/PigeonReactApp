import { getApi } from "./api";

export const GetDiscovers = async () => getApi("Channel/getdiscovers", {}, {});


