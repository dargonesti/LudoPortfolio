jQuery( document ).ready(function() {
	var allPlusBtn = jQuery('a[data-featherlight="image"]').toArray();
	
	jQuery(document).keydown(function(e) {
		var curFSimage = jQuery('.featherlight img.featherlight-image')[0];
		let i= -1;
		if(curFSimage){
			let nomImg = curFSimage.src.split("/").pop().replace(/\_\d{1,5}x\d{1,5}/i, "").split(".")[0];
			let reg = new RegExp(nomImg+"_\\d{1,4}x\\d{1,4}\\.","gi");
			switch(e.which) {
				case 37: // left
					i = allPlusBtn.findIndex(a=>reg.test(a.href));
					if(i>=0){
						let j = i===0 ? allPlusBtn.length-1 : i-1;
						curFSimage.src = allPlusBtn[j].href;
					}
				break;

				case 38: // up
				break;

				case 39: // right
					 i = allPlusBtn.findIndex(a=>reg.test(a.href));
					if(i>=0){
						curFSimage.src = allPlusBtn[(i+1) % allPlusBtn.length].href;
					}
				break;

				case 40: // down
				break;

				default: return; // exit this handler for other keys
			}
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});

////////////SECTION LOAD ORIGINAL IMAGE
		function tryUrl(elem, nomImg, curCol, allCol){
			let nextCol = Array.from(allCol).pop();
			allCol.delete(nextCol);
			let newUrl = `/2/images/peintures/${curCol}/${nomImg}`;
			console.log("Try URL : " + newUrl);
			elem.onerror = ()=>{
				console.warn("ERROR LOAD img : " + newUrl);
				tryUrl(elem,nomImg,nextCol, allCol);
			};
			elem.src = newUrl;
		}
	
		var allParents = jQuery('.sp-simpleportfolio-item.shuffle-item.filtered').toArray();
	
		let allCollections = allParents.reduce((all,cur,i)=>{
			JSON.parse(
				allParents[i].attributes["data-groups"].value)
			.forEach(rawCol=>{
				all.add(rawCol.replace("-",""));
				});
				return all;
		}, new Set());
		console.log(allCollections);
				
		var observer = new WebKitMutationObserver(function(mutations) {
			console.log("On Mutated");
	
			let curFSimage = jQuery('.featherlight img.featherlight-image')[0];
			
			if(curFSimage ){
				if(/spsimpleportfolio/i.test(curFSimage.src)){
					let curAllCol = new Set(allCollections);
					let sousSection = "disponibles";
					let i = allPlusBtn.findIndex(a=>a.href == curFSimage.src);
					sousSection = JSON.parse(
						allParents[i].attributes["data-groups"].value)
						.pop().replace("-","");
	
					curAllCol.delete(sousSection);
					let nomImg = curFSimage.src.split("/").pop().replace(/\_\d{1,5}x\d{1,5}/i, "");
					let newUrl = `/2/images/peintures/${sousSection}/${nomImg}`;
	
					//console.log(newUrl);
					tryUrl(curFSimage, nomImg, sousSection, curAllCol);
				}
			}
		});
		observer.observe(document, {
			childList: true
			, subtree: true,
			attributes:true //optional?
		});
		
});


/// Ajouter CSS à la page : 
//.featherlight .featherlight-image {
//    width: auto;
//    max-height: 800px;
//}