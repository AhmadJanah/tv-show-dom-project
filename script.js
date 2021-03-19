//You can edit ALL of the code here
function setup() {
    const allEpisodes = getAllEpisodes();
    makePageForEpisodes(allEpisodes);
    setupSelector(allEpisodes);
}

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
    episodeOption.innerHTML = episodeTitle;
    episodeSelect.appendChild(episodeOption);

}

function getSelectedEpisode(){
    let selectorVal = document.getElementById("episodeSelect").value;
    const allEpisodes = getAllEpisodes();
    let resultsCount = document.getElementById("resultsCount");
    resultsCount.innerHTML = " ";
    document.getElementById("searchText").value = ""; 
    clearRoot();
    if (selectorVal === "all"){
        makePageForEpisodes(allEpisodes);
    }
    else{
        let newEpisode = allEpisodes.find(episode => episode.name === selectorVal);
        setBoxEpisode(newEpisode);
    } 
}

function clearRoot(){
    let epContainer = document.getElementById("epContainer");
    
    let divEpisode = document.querySelectorAll(".divEpisode");
    divEpisode.forEach(dive => {
        epContainer.removeChild(dive);
    })
}

function searchEpisode(){
    let textVal = document.getElementById("searchText").value;
    let searchText = textVal.charAt(0).toUpperCase() + textVal.substring(1);
    let searchText2 = textVal.charAt(0) + textVal.substring(1).toLowerCase();
    document.getElementById("episodeSelect").value = "";
    const allEpisodes = getAllEpisodes();
    let newEpisodes = [];
    allEpisodes.forEach(episode => {
        if (episode.summary.toUpperCase().includes(textVal.toUpperCase()) || episode.name.toUpperCase().includes(textVal.toUpperCase())) {
            let tempSummary;
            let tempTitle;
            if (episode.summary.toUpperCase().includes(textVal.toUpperCase())) {
                if (episode.summary.includes(textVal))
                    tempSummary = episode.summary.replace(textVal, `<span>${textVal}</span>`)
                else if (episode.summary.includes(searchText))
                    tempSummary = episode.summary.replace(searchText, `<span>${searchText}</span>`)
                else if (episode.summary.includes(searchText2))
                    tempSummary = episode.summary.replace(searchText2, `<span>${searchText2}</span>`)
                else if (episode.summary.includes(textVal.toUpperCase()))
                    tempSummary = episode.summary.replace(textVal.toUpperCase(), `<span>${textVal.toUpperCase()}</span>`)
                else if (episode.summary.includes(textVal.toLowerCase()))
                    tempSummary = episode.summary.replace(textVal.toLowerCase(), `<span>${textVal.toLowerCase()}</span>`)
                episode.summary = tempSummary;
            }

            if (episode.name.toUpperCase().includes(textVal.toUpperCase())) {
                if (episode.name.includes(textVal))
                    tempTitle = episode.name.replace(textVal, `<span>${textVal}</span>`)
                else if (episode.name.includes(searchText))
                    tempTitle = episode.name.replace(searchText, `<span>${searchText}</span>`)
                else if (episode.name.includes(searchText2))
                    tempTitle = episode.name.replace(searchText2, `<span>${searchText2}</span>`)
                else if (episode.name.includes(textVal.toUpperCase()))
                    tempTitle = episode.name.replace(textVal.toUpperCase(), `<span>${textVal.toUpperCase()}</span>`)
                else if (episode.name.includes(textVal.toLowerCase()))
                    tempTitle = episode.name.replace(textVal.toLowerCase(), `<span>${textVal.toLowerCase()}</span>`)
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

window.onload = setup;