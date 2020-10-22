{/*********
Date:        Project: 
-----------------------------------------
08.05.18     Lauren & Lychee

**********/ }
import { CONSTANT_TRAVEL,CONSTANT_WEDDING,CONSTANT_URBAN,CONSTANT_PEOPLE,CONSTANT_CONCERT } from '../configs/constants'

{/************************** Header Data *************************/ }
const headerData = {
  bgImage: require('../../images/qwe2.jpg'),
  title: "All Projects",
  date: "2017 - Present",
  desc: "Snapshots through the Years",
  // style: "TEST"
};

{/************************** Project Data *************************/ }

const imageArray = [
 
  {
    title: "Aymand + Amanda's Wedding",
    date: "January 2019",
    coverImage: require('../../images/qwe1.jpg'),
    link: "/wedding_ww2", 
    category: CONSTANT_WEDDING,
    bannerStyle: "light"
  }, 
  {
    title: "Sister's Double Wedding",
    date: "December 2018",
    coverImage: require('../../images/qwe3.jpg'),
    link: "/wedding_ww", 
    category: CONSTANT_WEDDING,
    bannerStyle: "dark"
  }, 
];

{/*********************** Return Object Data ***********************/ }

const projectData = {
  imageArray: imageArray,
  projectHeader: headerData
}

export default projectData;