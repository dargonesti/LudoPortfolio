var sharedFileName = "file.txt";

var openFile = function (event) {
    var input = event.target;
    var reader = new FileReader();
    var fileName = event.srcElement.value.split("\\");
    sharedFileName = fileName[fileName.length - 1];

    reader.onload = function () {
        var text = reader.result;
        var node = document.getElementById('output');
        var newText = text;
        //applyReplace(text, lstFindReplace[4]);
        //newText = applyReplace(newText, lstFindReplace[1]);
        //for(var replacesInd = 5; replacesInd <= 24; replacesInd++)
        //	newText = applyReplace(newText, lstFindReplace[replacesInd]);

        newText = applyReplace(newText, lstFindReplace[30]);
        newText = applyReplace(newText, lstFindReplace[1]);
        
        i = 0;
        node.innerText = newText;
        //node.innerText = text;
        download(sharedFileName + ".txt", newText);
    };
    reader.readAsText(input.files[0]);
};

var newL = "((?:\\r\\n|\\r|\\n)\\s*)";
var notL = "[^\\w]";
var i = 0;
var Counterof5 = 5;

/*START OF FIND/REPLACE CHAIN*/

var lstFindReplace = [
    //0
    [new RegExp(newL + "(" + alone("loop") + "|" + alone("next") + ")(.*)$", "gmi"),
    (p1, p2) => '\nUtils.AddCallTime("' + sharedFileName + '",' + i + ")\n" +
        p1 + p2 +
        '\nUtils.CloseLoopCallTime("' + sharedFileName + '",' + (i++) + ')\n'],
    //1
    [/^\s*[\r\n]/gm,//new RegExp("^\\s*" + newL + "?$"), 
        (x) => ""],
    //2
    [new RegExp(newL + "\s*(loop|next)([^\w])", "gmi"), (p1, p2, p3) => p1 + '\nUtils.AddCallTime("' + sharedFileName + '",' + (i++) + ")" + p1 + p2 + p3],
    //3
    [/\s+(Loop|Next)\s+/gi, (p1, p2) => 'AddCallTime("' + sharedFileName + '",' + (i++) + ")\n" + p1],

    // Find/Replace des champs de text vs paramètres pour appel as service
    //4 ( Génère les Find-n-R suivants )
    [/(\w[^=]*) = (.*)$/gm, (p1, p2, p3) => '//' + (Counterof5++) + '\n[/' + p2 + '/gi, ()=>"' + p3 + '"],'],
    //5
    [/lblPlanDictionaryDatabaseName.Text/gi, () => "prmPlanDictionaryDatabaseName"],
    //6
    [/lblValueRatefileDatabaseName.Text/gi, () => "prmValueRateFile"],
    //7
    [/lblAssumptionsDatabaseName.Text/gi, () => "prmAssumpRateFile"],
    //8
    [/lblPolicyExtractDatabaseName.Text/gi, () => "prmPolicyExtractDatabaseName"],
    //9
    [/cboPolicyExtractTableName2.SelectedValue/gi, () => "prmPolicyExtractTableName"],
    //10
    [/txtNameOutput2.Text/gi, () => "tableGroupee"],
    //11
    [/optCalculComplet.Checked/gi, () => "Not prmMaxirance"],
    //12
    [/optCalculMaxirance.Checked/gi, () => "prmMaxirance"],
    //13
    [/optCompany(0).Checked/gi, () => "prmIA"],
    //14
    [/optCompany(1).Checked/gi, () => "Not prmIA"],
    //15
    [/chkPegging.Checked/gi, () => "prmPegg"],
    //16
    [/chkPS.Checked/gi, () => "prmStatuoMort"],
    //17
    [/chkQuin.Checked/gi, () => "prmCreationTabQuin"],
    //18
    [/chkSplitMaxi.Checked/gi, () => "prmDivSplit"],
    //19
    [/chkProfitInterest.Checked/gi, () => "prm1pcInt"],
    //20
    [/chkProfitMortality.Checked/gi, () => "prm25pcMort"],
    //21
    [/chkProfit25.Checked/gi, () => "prm25cExp"],
    //22
    [/txtTaxe.Text/gi, () => "prmPremiumTaxe.ToString()"],
    //23
    [/IsForm/gi, () => "False"],


    //24
    [/^\s*(False|True) = (True|False)\s*$/gi, () => ""],


    //25 - remove some Warnings
    [/\s*'UPGRADE_WARNING: Couldn't resolve default property of object.*/g, (p1, p2) => ""],
    //26
    [/\s*'UPGRADE_NOTE: IsMissing.*/g, () => ""],
    //27
    [/\s*'UPGRADE_NOTE: Erase was upgraded.*/g, () => ""],
    //28
    [/Click for more.*(\n|\r|\n\r|\r\n)/gi, (p1) => ""],
    //29
    [/On error goto.*/gi, (p1) => "'" + p1],



    //30 - Cleanups apparences nom de variables Assumptions
    [/\[(Sex|Smk|Table|Age|Description|Volume|COI_Option)\]/gi, function (p1, p2) { console.log("p1:" + p1 + "   p2: " + p2); return p2; }]


];

/*END OF FIND/REPLACE CHAIN*/

function applyReplace(strOri, arrFindReplace) {
    return strOri.replace(arrFindReplace[0], arrFindReplace[1]);
}


function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function alone(strOri) {
    return notL + strOri + notL;
}
