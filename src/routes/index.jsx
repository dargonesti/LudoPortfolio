import React, { lazy} from "react"; 
  
//import LandingPage from "views/LandingPage/LandingPage.jsx";
const LandingPage = lazy(() => import("views/LandingPage/LandingPage.jsx"));
const Components = lazy(() => import("views/Components/Components.jsx"));
const ProfilePage = lazy(() => import("views/ProfilePage/ProfilePage.jsx"));
const Inspiration = lazy(() => import("views/InspirationPage/InspirationPage.jsx"));
 

var indexRoutes = [
 
  { secure: false, path: "/component", name: "Components", component: Components },
  { secure: false, path: "/components", name: "Components", component: Components },
  { secure: false, path: "/inspiration", name: "Inspiration", component: Inspiration },
  { secure: false, path: "/inspirations", name: "Inspiration", component: Inspiration },
  { secure: false, path: "/landing", name: "LandingPage", component: LandingPage }, 
  { secure: true, path: "/profile", name: "ProfilePage", component: ProfilePage },
  { secure: true, path: "/test", name: "LandingPage", component: LandingPage },
  { secure: false, path: "/", name: "LandingPage", component: LandingPage },

];
 
 
export default indexRoutes;
