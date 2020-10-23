{/*********
ProjectName: 08.05.18_Wedding_Cbass_Becca
Date: 08.05.18_Wedding_Cbass_Becca
Location: Maui, Hawaii
Notes:
**********/}

import shuffle from '../configs/shuffle'

{/************************** Header Data *************************/ }
const headerData = {
  bgImage: require('../../images/Portraits/1.webp'),
  title: "Sebastian and Becca's Wedding",
  date: "August 5th, 2018",
  desc: "High School Sweet Hearts tie the knot in Maui"
};

{/************************** Gallery Data *************************/ }
const imageArray = [
  // {
  //   src: require('../../images/slider6.jpg'),
  //   thumbnail: require('../../images/slider6.jpg'),
  //   caption: 'Lauren',
  //   category: "Port"
  // }, {
  //   src: require('../../images/slider7.jpg'),
  //   thumbnail: require('../../images/slider7.jpg'),
  //   caption: 'Lychee ',
  //   category: "Wed"
  // }
];

for (var i = 1; i <= 1; i++) {
  const obj = {
    src: require('../../images/Portraits/2' /*+ i*/ + '.webp'),
    thumbnail: require('../../images/Portraits/2' /*+ i*/ + '.webp'),
    caption: '',
    category: ""
  }
  imageArray.push(obj);
}
{/*********************** Return Object Data ***********************/ }

const projectData = {
  imageArray: (imageArray),
  projectHeader: headerData
}

export default projectData;
