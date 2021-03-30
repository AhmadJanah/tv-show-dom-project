//You can edit ALL of the code here

////////////  **********               Episodes           **********////////////
// This variable contain all Episodes
let allEpisodes;

function setup() {
    // setAllEpisodes("https://api.tvmaze.com/shows/167/episodes");
    const allShows = getAllShows();
    setAllShows(allShows);
}

// Fetch the episodes by API
function setAllEpisodes(url){
    // let url = "https://api.tvmaze.com/shows/167/episodes";

    fetch(url).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw `${response.status} ${response.statusText}`
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

//   To help in sorting
function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
    } else if (nameA < nameB) {
        comparison = -1;
    }
    return comparison;
}

// loop on all episodes to draw the page DOM
function makePageForEpisodes(episodeList) {
    
    episodeList.forEach(episode => {
        setBoxEpisode(episode);
    });
}

// prepare the episode selector
function setupSelector(episodeList){
    let episodeSelect = document.getElementById("episodeSelect");
    episodeList.forEach(episode => {
        setSelectorEpisode(episode, episodeSelect);
    });
}

// Draw the episode inside the div
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
    appendLineBreak(divEpisode);
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

// setup the code pf the Episode to add it in the title
function getEpisodeCode(episode) {
    let season = episode.season;
    let number = episode.number;
    if (season <= 9)
        season = "0" + season;
    if (number <= 9)
        number = "0" + number;

    return "S" + season + "E" + number;

}

// Draw the episode inside the selector
function setSelectorEpisode(episode, episodeSelect){
    let episodeTitle = getEpisodeCode(episode) + " - " + episode.name;
    let episodeOption = document.createElement("option");
    
    episodeOption.value = episode.name;
    episodeOption.className = "episodeOption";
    episodeOption.innerHTML = episodeTitle;
    episodeSelect.appendChild(episodeOption);

}

// To get the selected Episode and prepare the page according to the selection
function getSelectedEpisode(){
    let selectorVal = document.getElementById("episodeSelect").value;
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
        setBoxEpisode(newEpisode);
    } 

}

// Clear all previous fill in the episodes selector
function ClearEpisodeSelect(){
    let episodeSelect = document.getElementById("episodeSelect");
    let episodeOptions = document.querySelectorAll(".episodeOption");
    episodeOptions.forEach(opt =>{
        episodeSelect.removeChild(opt);
    })
}

// Clear all previous episodes fill in episode div
function clearRoot(){
    let epContainer = document.getElementById("epContainer");
    
    let divEpisode = document.querySelectorAll(".divEpisode");
    divEpisode.forEach(dive => {
        epContainer.removeChild(dive);
    })   
}

// remove all span from the episode texts
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

// to loop on episodes name and episodes summary
function clearAllSpans(arr){
    arr.forEach(ar => {
        ar.name = clearSpan(ar.name);
        ar.summary = clearSpan(ar.summary);
    })
}

// To find the episode that match writing in the search box and color its background 
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

// to return back to the Shows list
function backToShows(){
    
    let episodediv = document.getElementById("allEpisodesContainer");
    episodediv.hidden = true;
    let showdiv = document.getElementById("allShowsContainer");
    showdiv.hidden = false;
    
}




/////////////////// *********           Shows Section           *********////////////////

// Draw the content of shows selector
function setSelectorShow(show, showSelect) {
    let showOption = document.createElement("option");
    showOption.value = show.name;
    showOption.innerHTML = show.name;
    showSelect.appendChild(showOption);

}

// To get the selected shoe from show selector and draw its episodes
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
    setAllEpisodes(myUrl);
    // }
}

/////  ******           Level 500         *********  ///////

// Draw the show inside the div
function setBoxShow(show) {
    let shContainer = document.getElementById("shContainer");
    appendLineBreak(shContainer);

    let divShow = document.createElement("div");
    divShow.className = "divShow";
    let showName = document.createElement("div");
    showName.className = "showName";
    let showTitle = document.createElement("h1");
    showTitle.innerHTML = show.name;
    showTitle.addEventListener('click', (e) => {
        goEpisodes(show.id);
    });
    showName.appendChild(showTitle);
    divShow.appendChild(showName);

    let detailsShowDiv = document.createElement("div");
    detailsShowDiv.className = "detailsShowDiv";

    let imgShowDiv = document.createElement("div");
    imgShowDiv.className = "imgShowDiv";
    let midImg = document.createElement("img");
    midImg.className = "showImage";
    if (show.image != null)
        midImg.src = show.image.medium;
    midImg.alt = "Show Medium Image";
    imgShowDiv.appendChild(midImg);
    detailsShowDiv.appendChild(imgShowDiv);
    let summaryShowDiv = document.createElement("div");
    summaryShowDiv.className = "summaryShowDiv";
    let summaryShowP = document.createElement("p");
    summaryShowP.innerHTML = show.summary;
    summaryShowDiv.appendChild(summaryShowP);
    detailsShowDiv.appendChild(summaryShowDiv);

    let showPropertyDiv = document.createElement("div");
    showPropertyDiv.className = "showPropertyDiv";
    let rateShow = document.createElement("p");
    rateShow.innerHTML = "Rated: " + show.rating.average;
    showPropertyDiv.appendChild(rateShow);
    // appendLineBreak(showPropertyDiv);
    let genresShow = document.createElement("p");
    genresShow.innerHTML = "Genres: " + show.genres;
    showPropertyDiv.appendChild(genresShow);
    // appendLineBreak(showPropertyDiv);
    let statusShow = document.createElement("p");
    statusShow.innerHTML = "Status: " + show.status;
    showPropertyDiv.appendChild(statusShow);
    let runTimeShow = document.createElement("p");
    runTimeShow.innerHTML = "Status: " + show.runtime;
    showPropertyDiv.appendChild(runTimeShow);

    detailsShowDiv.appendChild(showPropertyDiv);
    divShow.appendChild(detailsShowDiv);
    shContainer.appendChild(divShow);

}

// Draw the episodes for the clicked show from the list
function goEpisodes(showId){
    let myUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;
    let showdiv = document.getElementById("allShowsContainer");
    showdiv.hidden = true;
    let episodediv = document.getElementById("allEpisodesContainer");
    episodediv.hidden = false;
    clearRoot();
    setAllEpisodes(myUrl);

    
}

// To draw a line break 
function appendLineBreak(parent){
    let linebreak = document.createElement("br");
    parent.appendChild(linebreak);
}

// Main function to setup the page for drawing the shows list
function setAllShows(theShows) {
    
    ClearEpisodeSelect();
    makePageForShows(theShows);
    setShowSelector();
}

// loop on all show to draw inside the div
function makePageForShows(showList) {
    let episodediv = document.getElementById("allEpisodesContainer");
    episodediv.hidden = true;
    let showdiv = document.getElementById("allShowsContainer");
    showdiv.hidden = false;
    // if (episodediv != null)
    //     epContainer.remove(episodediv);
    
    showList.forEach(show => {
        setBoxShow(show);
    });
    //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

// Draw the sortede shows inside the selector
function setShowSelector(){
    const allShows = getAllShows();
    allShows.sort(compare);
    let showSelect = document.getElementById("showsSelect");
    allShows.forEach(show => {
        setSelectorShow(show, showSelect);
    });
}

function searchShow() {
    let textVal = document.getElementById("showSearchText").value;
    let searchText = textVal.charAt(0).toUpperCase() + textVal.substring(1);
    let searchText2 = textVal.charAt(0) + textVal.substring(1).toLowerCase();
    // document.getElementById("episodeSelect").value = "";
    const allShows = getAllShows();
    // clearAllSpans(allEpisodes);
    let newShows = [];
    allShows.forEach(show => {
        
        if (show.summary.toUpperCase().includes(textVal.toUpperCase()) || show.name.toUpperCase().includes(textVal.toUpperCase())
            || show.genres.find(gen => gen.toUpperCase().includes(textVal.toUpperCase()))) {
            let tempSummary = show.summary;
            let tempTitle = show.name;
            let tempGenres = show.genres;
            

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

                show.summary = tempSummary;
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

                show.name = tempTitle;
            }

            if (tempGenres.find(gen => gen.toUpperCase().includes(textVal.toUpperCase()))) {
                if (tempGenres.find(gen => gen.includes(textVal)))
                    tempGenres = tempGenres.map(gen => gen.replace(textVal, `<span>${textVal}</span>`));
                else if (tempGenres.find(gen => gen.includes(searchText)))
                    tempGenres = tempGenres.map(gen => gen.replace(searchText, `<span>${searchText}</span>`));
                else if (tempGenres.find(gen => gen.includes(searchText2)))
                    tempGenres = tempGenres.map(gen => gen.replace(searchText2, `<span>${searchText2}</span>`));
                else if (tempGenres.find(gen => gen.includes(textVal.toUpperCase())))
                    tempGenres = tempGenres.map(gen => gen.replace(textVal.toUpperCase(), `<span>${textVal.toUpperCase()}</span>`));
                else if (tempGenres.find(gen => gen.includes(textVal.toLowerCase())))
                    tempGenres = tempGenres.map(gen => gen.replace(textVal.toLowerCase(), `<span>${textVal.toLowerCase()}</span>`));

                show.genres = tempGenres;
            }

            newShows.push(show);
        }

    })
    clearShows();
    let showResultsCount = document.getElementById("showResultsCount");
    showResultsCount.innerHTML = newShows.length + "/" + allShows.length + " Results";
    setAllShows(newShows);
}

function clearShows(){
    let shContainer = document.getElementById("shContainer");

    let breakLines = shContainer.querySelectorAll("br");

    let divShow = document.querySelectorAll(".divShow");
    divShow.forEach(dive => {
        shContainer.removeChild(dive);
    })

    breakLines.forEach(line => {
        if (line.parentElement == shContainer)
            shContainer.removeChild(line);
    })
}

window.onload = setup
