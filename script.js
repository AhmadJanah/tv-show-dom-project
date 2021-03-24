//You can edit ALL of the code here
let allEpisodes;
function setup(url) {

    // URL = "https://api.tvmaze.com/shows/82/episodes";

    fetch(url).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw `${response.sttus} ${response.statusText}`
    })
        .then(function (data) {
            allEpisodes = data; 
            ClearEpisodeSelect();
            makePageForEpisodes(allEpisodes);
            setupSelector(allEpisodes);
        })
        .catch(function (error) {
            console.log("There are some Errors", error);
        })



}


/////////////////// *********           Episodes Section           *********////////////////


function makePageForEpisodes(episodeList) {
    const rootElem = document.getElementById("root");
    episodeList.forEach(episode => {
        setBoxEpisode(episode);
    });
    //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

function setupSelector(episodeList){
    let episodeSelect = document.getElementById("episodeSelect");
    episodeList.forEach(episode => {
        setSelectorEpisode(episode, episodeSelect);
    });

    const allShows = getAllShows();
    let showSelect = document.getElementById("showsSelect");
    allShows.forEach(show => {
        setSelectorShow(show, showSelect);
    });
}

function setBoxEpisode(episode) {
    let epContainer = document.getElementById("epContainer");
    
    let divEpisode = document.createElement("div");
    divEpisode.className = "divEpisode";
    let episodeName = document.createElement("div");
    episodeName.className = "episodeName";
    let episodeNameTitle = document.createElement("p");

    episodeNameTitle.innerHTML = episode.name + " - " + getEpisodeCode(episode);
    episodeName.appendChild(episodeNameTitle);
    divEpisode.appendChild(episodeName);
    let linebreak = document.createElement("br");
    divEpisode.appendChild(linebreak);
    let imgDiv = document.createElement("div");
    imgDiv.className = "imgDiv";
    let midImg = document.createElement("img");
    if (episode.image != null)
        midImg.src = episode.image.medium;
    midImg.alt = "Medium Image";
    imgDiv.appendChild(midImg);
    divEpisode.appendChild(imgDiv);
    let summaryTextDiv = document.createElement("div");
    summaryTextDiv.className = "summaryTextDiv";
    let summaryP = document.createElement("p");
    summaryP.innerHTML = episode.summary;
    summaryTextDiv.appendChild(summaryP);
    divEpisode.appendChild(summaryTextDiv);

    epContainer.appendChild(divEpisode);

}

function getEpisodeCode(episode) {
    let season = episode.season;
    let number = episode.number;
    if (season <= 9)
        season = "0" + season;
    if (number <= 9)
        number = "0" + number;

    return "S" + season + "E" + number;

}

function setSelectorEpisode(episode, episodeSelect){
    let episodeTitle = getEpisodeCode(episode) + " - " + episode.name;
    let episodeOption = document.createElement("option");
    
    episodeOption.value = episode.name;
    episodeOption.className = "episodeOption";
    episodeOption.innerHTML = episodeTitle;
    episodeSelect.appendChild(episodeOption);

}

function getSelectedEpisode(){
    let selectorVal = document.getElementById("episodeSelect").value;
    // const allEpisodes = getAllEpisodes();
    let resultsCount = document.getElementById("resultsCount");
    resultsCount.innerHTML = " ";
    document.getElementById("searchText").value = ""; 
    clearRoot();
    clearAllSpans(allEpisodes);
    if (selectorVal === "all"){
        makePageForEpisodes(allEpisodes);
    }
    else{
        let newEpisode = allEpisodes.find(episode => episode.name === selectorVal);
        // newEpisode.summary = clearSpan(newEpisode.summary);
        // newEpisode.name = clearSpan(newEpisode.name);
        setBoxEpisode(newEpisode);
    } 

}

function ClearEpisodeSelect(){
    let episodeSelect = document.getElementById("episodeSelect");
    let episodeOptions = document.querySelectorAll(".episodeOption");
    episodeOptions.forEach(opt =>{
        episodeSelect.removeChild(opt);
    })
}

function clearRoot(){
    let epContainer = document.getElementById("epContainer");
    
    let divEpisode = document.querySelectorAll(".divEpisode");
    divEpisode.forEach(dive => {
        epContainer.removeChild(dive);
    })
}

function clearSpan(str){
    if (str != null){
        let tempStr = str;
        
        if (tempStr.includes("span")){
                tempStr = tempStr.replace("<span>","");
                tempStr = tempStr.replace("</span>", "");
            }
        return tempStr;
    }
}

function clearAllSpans(arr){
    arr.forEach(ar => {
        ar.name = clearSpan(ar.name);
        ar.summary = clearSpan(ar.summary);
    })
}

function searchEpisode(){
    let textVal = document.getElementById("searchText").value;
    let searchText = textVal.charAt(0).toUpperCase() + textVal.substring(1);
    let searchText2 = textVal.charAt(0) + textVal.substring(1).toLowerCase();
    document.getElementById("episodeSelect").value = "";
    // const allEpisodes = getAllEpisodes();
    clearAllSpans(allEpisodes);
    let newEpisodes = [];
    allEpisodes.forEach(episode => {

        if (episode.summary.toUpperCase().includes(textVal.toUpperCase()) || episode.name.toUpperCase().includes(textVal.toUpperCase())) {
            let tempSummary = episode.summary;
            let tempTitle = episode.name;

            if (tempSummary.toUpperCase().includes(textVal.toUpperCase())) {

                if (tempSummary.includes(textVal))
                    tempSummary = tempSummary.replace(textVal, `<span>${textVal}</span>`);
                else if (tempSummary.includes(searchText))
                    tempSummary = tempSummary.replace(searchText, `<span>${searchText}</span>`);
                else if (tempSummary.includes(searchText2))
                    tempSummary = tempSummary.replace(searchText2, `<span>${searchText2}</span>`);
                else if (tempSummary.includes(textVal.toUpperCase()))
                    tempSummary = tempSummary.replace(textVal.toUpperCase(), `<span>${textVal.toUpperCase()}</span>`);
                else if (tempSummary.includes(textVal.toLowerCase()))
                    tempSummary = tempSummary.replace(textVal.toLowerCase(), `<span>${textVal.toLowerCase()}</span>`);

                episode.summary = tempSummary;
            }

            if (tempTitle.toUpperCase().includes(textVal.toUpperCase())) {
                
                if (tempTitle.includes(textVal))
                    tempTitle = tempTitle.replace(textVal, `<span>${textVal}</span>`);
                else if (tempTitle.includes(searchText))
                    tempTitle = tempTitle.replace(searchText, `<span>${searchText}</span>`);
                else if (tempTitle.includes(searchText2))
                    tempTitle = tempTitle.replace(searchText2, `<span>${searchText2}</span>`);
                else if (tempTitle.includes(textVal.toUpperCase()))
                    tempTitle = tempTitle.replace(textVal.toUpperCase(), `<span>${textVal.toUpperCase()}</span>`);
                else if (tempTitle.includes(textVal.toLowerCase()))
                    tempTitle = tempTitle.replace(textVal.toLowerCase(), `<span>${textVal.toLowerCase()}</span>`);

                episode.name = tempTitle;
            }
            
            newEpisodes.push(episode);
        }
       
    })

    clearRoot();
    let resultsCount = document.getElementById("resultsCount");
    resultsCount.innerHTML = newEpisodes.length + "/" + allEpisodes.length + " Results";
    makePageForEpisodes(newEpisodes)
}

function copyArray(arr){
    let newArr = [];
    arr.forEach(ar =>{
        newArr.push(ar);
    })
    return newArr;
}




/////////////////// *********           Shows Section           *********////////////////

function setSelectorShow(show, showSelect) {
    let showOption = document.createElement("option");
    showOption.value = show.name;
    showOption.innerHTML = show.name;
    showSelect.appendChild(showOption);

}

function getSelectedShow(){
    let selectorVal = document.getElementById("showsSelect").value;
    const allShows = getAllShows();
    
    // if (selectorVal === "all") {
    //     makePageForEpisodes(allEpisodes);
    // }
    // else {
        let newShow = allShows.find(show => show.name === selectorVal);
   
    let myUrl = `https://api.tvmaze.com/shows/${newShow.id}/episodes`;
    
    clearRoot();
    setup(myUrl);
    // }
}

window.onload = setup("https://api.tvmaze.com/shows/83/episodes");
