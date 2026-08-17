import { getStore } from "@netlify/blobs";

export const getMessagesStore = () => getStore("messages");
export const getResidentsStore = () => getStore("residents");
export const getImagesStore = () => getStore({ name: "message-images", siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_API_TOKEN });
