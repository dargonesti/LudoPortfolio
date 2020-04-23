import Components from "views/Components/Components.jsx";
import LandingPage from "views/LandingPage/LandingPage.jsx"; 
import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
 
import utils from "utils/utils"; 

// TODO : https://reactjs.org/docs/code-splitting.html#reactlazy

var indexRoutes = [

  // Section admin/comptable
  { secure: false, path: "/component-page", name: "Components", component: Components },
  { secure: false, path: "/landing-page", name: "LandingPage", component: LandingPage }, 
  { secure: true, path: "/profile-page", name: "ProfilePage", component: ProfilePage },
  { secure: false, path: "/", name: "LandingPage", component: LandingPage },

];

utils.log(process.env);
 
export default indexRoutes;
