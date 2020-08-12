/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
 
import "./scss/HeaderTriangle.scss"

let imgWedding = ["3_XT034714.jpg", "2_XT034657.jpg", "3_XT034770 (1).jpg", "3_XT034778.jpg", "4_XT033079 (2).jpg", "5_XT033095 (2).jpg"]
let getWD = (i) => ("url(img/Wedding/" + imgWedding[i % imgWedding.length] + ")")//linear-gradient(to right bottom, rgba(0,200,123, 0.3), rgba(223,234,94,0.2)),

let imgPortrait = ["4_XT201199 (1).jpg", "5_DSCF5764 (1).jpg", "5_DSCF5807.jpg", "3_XT032214.webp"]
let getP = (i) => (" url(img/Portraits/" + imgPortrait[i % imgPortrait.length] + ")")//linear-gradient(to right bottom, rgba(200,0,1, 0.2), rgba(123,0,234,0.2)),

let imgNature = ["0_XT035256.jpg", "4_XT032371 (1).webp", "4_XT032376.webp", "5_XT032153.jpg", "DSCF9114_4.jpg"]
let getN = (i) => ("url(img/Nature/" + imgNature[i % imgNature.length] + ")")//linear-gradient(to right bottom, rgba(0,200,123, 0.3), rgba(223,234,94,0.2)),

let selfPortrait = ["4_XT031878.jpg", "3_XT031397.webp", "3_XT031376.jpg", "redBlueBall.jpg"]
let getSP = (i) => ("url(img/PortraitsMoi/" + selfPortrait[i % selfPortrait.length] + ")")//linear-gradient(to right bottom, rgba(234,234,234, 0.3), rgba(234,234,99,0.3)),


const HeaderTriangle = ({ children, startDelay, style , contentPhoto, contentVideo, contentCode}) => {
    let [openedFace, setOpen] = useState(null);
    let isOpen=(cat)=>(cat==openedFace?" open":"")

    return (
        <div id="disciplines" >
            <div id="iPhoto" className={isOpen("photo")} style={{ backgroundImage: getP(2) }}
             onClick={()=>{
                setOpen("photo")
            }}>
                Portraits
                <div className="content">
                    {contentPhoto}
                </div>
          </div>
            <div id="iVideo"  className={isOpen("video")} style={{ backgroundImage: getWD(1) }}
             onClick={()=>{
                setOpen("video")
            }}>
                <div></div> <div>Mariages
                    
                <div className="content">
                    {contentVideo}
                </div>
                </div>
            </div>
            <div id="iCode"  className={isOpen("code")} style={{ backgroundImage: getN(2) }} 
            onClick={()=>{
                setOpen("code")
            }}>
                <div>Nature
                    
                <div className="content">
                    {contentCode}
                </div></div> <div></div>
                
            </div>
        </div>
    );
};


HeaderTriangle.propTypes = {
    classes: PropTypes.object,
    style: PropTypes.object
};

export default (HeaderTriangle);