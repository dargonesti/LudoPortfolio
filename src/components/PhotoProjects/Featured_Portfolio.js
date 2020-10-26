{/*********
ProjectName: 2018_Europe
Date: 2018_Europe
Location: 
Notes:
**********/}

import shuffle from '../configs/shuffle'

{/************************** Header Data *************************/ }
const headerData = {
  bgImage: require('../../images/qwe1.webp'),
  title: "Featured Portfolio",
  date: "2017 - Present",
  desc: "Ecclectic Everything",
  style: "featured-header-mobile"
};

{/************************** Gallery Data *************************/ }
let imageArray = [];


{/************************** Travel Data *************************/ }
const travelArray = [];
const featTravel = [1,2,3];//[1,2,3,4,6,8,9,10,12,13,15,17,18,21,22,23,24,28,31,36,38,40,42,43,46];
/*LUDO
for (var i = 1; i <= 46; i++) {
  const obj = {
    src: require('../../images/Featured_Portfolio/Travel/Travel-' + i + '.jpg'),
    thumbnail: require('../../images/Featured_Portfolio/Travel/Travel-' + i + '.jpg'),
    caption: '',
    category: ["travel"]
  }
  if(featTravel.includes(i)){
    obj['category'].push('*')
  }
  travelArray.push(obj);
}*/

{/************************** People Data *************************/ }
let peopleArray = [];
const featPeople = [1,2,3];

peopleArray = featPeople.map(n =>
  ({
    src: require(`../../images/Portraits/${n}.webp`),
    thumbnail: require(`../../images/Portraits/desktop/${n}.webp`),
    caption: 'Portrait in Chibougamau by Photographer',
    category: ["ppl", '*']
  }))
{/************************** Wedding Data *************************/ }
let weddingArray = [];
const featWedding = [1,2,3];//[1,4,10,12,13,15,20,27,28,40,45,47,49,50];

weddingArray = featWedding.map(n =>
  ({
    src: require(`../../images/Weddings/w${n}.webp`),
    thumbnail: require(`../../images/Weddings/desktop/w${n}.webp`),
    caption: 'Wedding in Chibougamau by Photographer',
    category: ["wed", '*']
  }))

{/************************** Urban Data *************************/ }
let regionArray = [];
const featRegion = [1,2,3];

regionArray = featRegion.map(n =>
  ({
    src: require(`../../images/Regions/${n}.webp`),
    thumbnail: require(`../../images/Regions/desktop/${n}.webp`),
    caption: 'Nature and Cities of Québec by Photographer',
    category: ["region", '*']
  }))

{/************************** Concert Data *************************/ }
let productArray = [];
let featProduct = [1,2,3];//[2,6,8,9,16,23,26,29,39,40,43,44];
featProduct.shift();
try {
  productArray = featProduct.map(n =>
    ({
      src: require(`../../images/Products/${n}.webp`),
      thumbnail: require(`../../images/Products/desktop/${n}.webp`),
      caption: 'Products by Photographer',
      category: ["products", '*']
    }))//*/
} catch (ex) { 
  console.error(ex);
}
{/*********************** Return Object Data ***********************/ }
imageArray = [...shuffle(travelArray), ...peopleArray, ...weddingArray, ...regionArray, ...productArray];
// console.log("arrayIMages: " + JSON.stringify(imageArray))

const projectData = {
  imageArray: (imageArray),
  projectHeader: headerData
}

export default projectData;
