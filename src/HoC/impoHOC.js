import allowRedirect from "./allowRedirect";
//import subscriptions from "./subscriptions";

const mergedHOC = (rawComp, PageName, p2, p3) => allowRedirect(rawComp, PageName);
//subscriptions(allowRedirect(rawComp), p1,p2,p3);

export default mergedHOC;