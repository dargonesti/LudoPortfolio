import Components from "views/Components/Components.jsx";
import LandingPage from "views/LandingPage/LandingPage.jsx";
import IntroPage from "views/User/IntroPage.jsx";
import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
 
import utils from "utils/utils"; 

// TODO : https://reactjs.org/docs/code-splitting.html#reactlazy

var indexRoutes = [

  // Section admin/comptable
  { secure: true, path: "/find-user-page", name: "FindUserPage", component: FindUserPage },
  { secure: true, path: "/push-notification-page", name: "PushNotificationPage", component: PushNotificationPage },
  { secure: true, path: "/user-summary-page", name: "UserSummaryPage", component: UserSummaryPage },
  {secure: false, path:"/test", name: "Test", component: FindUserPage},//// SECTION Usager Normal
  { secure: false, path: "/component-page", name: "Components", component: Components },
  { secure: true, path: "/questions-page", name: "Questions", component: QuestionsPage },
  { secure: true, path: "/docs-page", name: "Documents", component: DocsPage },
  { secure: true, path: "/messages-page", name: "Messages", component: MessagesPage },
  { secure: true, path: "/chat-page", name: "Chat", component: ChatPage },
  { secure: false, path: "/landing-page", name: "LandingPage", component: LandingPage },
  { secure: false, path: "/intro-page", name: "IntroPage", component: IntroPage },
  { secure: true, path: "/profile-page", name: "ProfilePage", component: ProfilePage },
  { secure: true, path: "/user-profile-page", name: "UserProfilePage", component: UserProfilePage },
  { secure: false, path: "/reset-page", name: "ResetPage", component: ResetPage },
  { secure: false, path: "/login-page", name: "LoginPage", component: LoginPage },
  { secure: false, path: "/sign-in-page", name: "SignInPage", component: SignInPage },
  { secure: false, path: "/", name: "LandingPage", component: LandingPage },

];

utils.log(process.env);
 
export default indexRoutes;
