{/*********
ProjectName: 2018_Europe
Date: 2018_Europe
Location: 
Notes:
**********/}

import shuffle from '../configs/shuffle'

{/************************** Header Data *************************/ }
const headerData = {
  bgImage: require('../../images/qwe1.jpg'),
  title: "Featured Portfolio",
  date: "2017 - Present",
  desc: "Ecclectic Everything",
  style: "featured-header-mobile"
};

{/************************** Gallery Data *************************/ }
let imageArray = [];


{/************************** Travel Data *************************/ }
const travelArray = [];
const featTravel = [1];//[1,2,3,4,6,8,9,10,12,13,15,17,18,21,22,23,24,28,31,36,38,40,42,43,46];
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
const peopleArray = [];
const featPeople = [1,2,5,7,8,9,10,12,17,19,23,29,30];
/*LUDO
for (var i = 1; i <= 30; i++) {
  const obj = {
    src: require('../../images/Featured_Portfolio/People/People-' + i + '.jpg'),
    thumbnail: require('../../images/Featured_Portfolio/People/People-' + i + '.jpg'),
    caption: '',
    category: ["ppl"]
  }
  if(featPeople.includes(i)){
    obj['category'].push('*')
  }
  peopleArray.push(obj);
}*/
{/************************** Wedding Data *************************/ }
const weddingArray = [];
const featWedding = [1];//[1,4,10,12,13,15,20,27,28,40,45,47,49,50];

for (var i = 1; i <= 1; i++) {
  const obj = {
    src: require('../../images/Weddings/3_XT034778 ' + i + '.jpg'),
    thumbnail: require('../../images/Weddings/3_XT034778 ' + i + '.jpg'),
    caption: '',
    category: ["wed"]
  }
  if(featWedding.includes(i)){
    obj['category'].push('*')
  }
  weddingArray.push(obj);
}

{/************************** Urban Data *************************/ }
const urbanArray = [];
const featUrban = [1,3,4,6,8,14,21,26,27,28,31,35];
/*LUDO
for (var i = 1; i <= 35; i++) {
  const obj = {
    src: require('../../images/Featured_Portfolio/Urban/Urban-' + i + '.jpg'),
    thumbnail: require('../../images/Featured_Portfolio/Urban/Urban-' + i + '.jpg'),
    caption: '',
    category: ["urb"]
  }
  if(featUrban.includes(i)){
    obj['category'].push('*')
  }
  urbanArray.push(obj);
}*/

{/************************** Concert Data *************************/ }
const concertArray = [];
const featConcert = [1];//[2,6,8,9,16,23,26,29,39,40,43,44];
/*LUDO
for (var i = 1; i <= 44; i++) {
  const obj = {
    src: require('../../images/Featured_Portfolio/Concert/Concert-' + i + '.jpg'),
    thumbnail: require('../../images/Featured_Portfolio/Concert/Concert-' + i + '.jpg'),
    caption: '',
    category: ["concert"]
  }
  if(featConcert.includes(i)){
    obj['category'].push('*')
  }
  concertArray.push(obj);
}
*/
{/*********************** Return Object Data ***********************/ }
imageArray = [...shuffle(travelArray), ...shuffle(peopleArray), ...weddingArray, ...urbanArray, ...shuffle(concertArray)];
// console.log("arrayIMages: " + JSON.stringify(imageArray))

const projectData = {
  imageArray: (imageArray),
  projectHeader: headerData
}

export default projectData;
