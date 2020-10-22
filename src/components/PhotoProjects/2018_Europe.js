{/*********
ProjectName: 2018_Europe
Date: 2018_Europe
Location: 
Notes:
**********/}

import shuffle from '../configs/shuffle'

{/************************** Header Data *************************/ }
const headerData = {
  bgImage: require('../../images/Macro/4_XT039396.jpg'),
  title: "Europe 2018",
  date: "April 10 - May 7, 2018",
  desc: "Norway -> Germany -> Czech Republic -> Italy -> Croatia"
};

{/************************** Gallery Data *************************/ }
const imageArray = [];

for (var i = 6; i <= 6; i++) {
  const obj = {
    src: require('../../images/Macro/4_XT03939' + i + '.jpg'),
    thumbnail: require('../../images/Macro/4_XT03939' + i + '.jpg'),
    caption: '',
    category: ""
  }
  imageArray.push(obj);
}//*/
{/*********************** Return Object Data ***********************/ }

const projectData = {
  imageArray: (imageArray),
  projectHeader: headerData
}

export default projectData;
