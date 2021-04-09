//You can edit ALL of the code here

////////////  **********               Episodes           **********////////////
// This variable contain all Episodes
let allEpisodes;

function setup() {
    const allShows = getAllShows();
    setAllShows(allShows);
}

// Fetch the episodes by API
function setAllEpisodes(url, showId){
    
    fetch(url).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw `${response.status} ${response.statusText}`
    })
        .then(function (data) {
            allEpisodes = data;
            ClearEpisodeSelect();
            const castUrl = `https://api.tvmaze.com/shows/${showId}?embed=cast`;
            fetchCast(castUrl)
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
function fetchCast(url){
    fetch(url).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw `${response.status} ${response.statusText}`
    })
        .then(function (data) {
            const cast = data;
            showCast(cast);
        })
        .catch(function (error) {
            console.log("There are some Errors in Cast", error);
        })
}

function showCast(cast){
    let showCastDiv = document.querySelector(".showCastDiv");
    let subShowCastDiv = document.createElement("div");
    subShowCastDiv.className = "subShowCastDiv";
    
    let castTitlediv = document.createElement("div");
    castTitlediv.className = "castTitlediv";
    let castTitle = document.createElement("h2");
    castTitle.innerHTML = cast.name;
    castTitlediv.appendChild(castTitle);
    let pCast = document.createElement("p");
    pCast.innerHTML = "<strong>Rating: </strong>" + cast.rating.average + " &nbsp; &nbsp; <strong>Genres:</strong> " + cast.genres + " &nbsp; &nbsp; <strong>Status:</strong> " + cast.status + " &nbsp; &nbsp; <strong>RunTime:</strong> " + cast.runtime;
    castTitlediv.appendChild(pCast);
    subShowCastDiv.appendChild(castTitlediv);
    let imgShowCastDiv = document.createElement("div");
    imgShowCastDiv.className = "imgShowCastDiv";
    let castImg = document.createElement("img");
    if (cast.image.medium != null)
        castImg.src = cast.image.medium;
    else 
        castImg.src = cast.image.original;
    imgShowCastDiv.appendChild(castImg);
    let summaryCast = document.createElement("p");
    summaryCast.className = "summaryCast";
    summaryCast.innerHTML = cast.summary;
    imgShowCastDiv.appendChild(summaryCast);
    subShowCastDiv.appendChild(imgShowCastDiv);
    let showCasts = cast._embedded.cast;
    let mainCastDiv = document.createElement("div");
    mainCastDiv.className = "mainCastDiv";
    showCasts.forEach(showCast =>{

        let charsDiv = document.createElement("div");
        charsDiv.className = "charsDiv";
        charsImg = document.createElement("img");
        charsImg.className = "charsImg";
        console.log(showCast);
        if (showCast.person.image != null){
            if (showCast.person.image.medium != null)
                charsImg.src = showCast.person.image.medium;
            else
                charsImg.src = showCast.person.image.original;
    }
        charsImg.alt = "The image is not provided";
        charsImg.addEventListener('click', (e) => {
            personDetails(showCast.person.id, showCast.person.name, e);
        });
        charsDiv.appendChild(charsImg);
        let personDiv = document.createElement("div");
        let charsPerson = document.createElement("p");
        charsPerson.innerHTML = showCast.person.name;
        personDiv.appendChild(charsPerson);
        let charsAs = document.createElement("p");
        charsAs.innerHTML = "As:";
        personDiv.appendChild(charsAs);
        let charsChar = document.createElement("p");
        charsChar.className = "charsChar";
        charsChar.innerHTML = showCast.character.name;
        personDiv.appendChild(charsChar);
        charsDiv.appendChild(personDiv);
        let spaceDiv = document.createElement("div");
        spaceDiv.innerHTML = " &nbsp; &nbsp; ";
        charsDiv.appendChild(spaceDiv);
        mainCastDiv.appendChild(charsDiv);
    })
    subShowCastDiv.appendChild(mainCastDiv);
    showCastDiv.appendChild(subShowCastDiv);
}

function personDetails(castId, personName, e){
    const url = `https://api.tvmaze.com/people/${castId}/castcredits`;
    fetch(url).then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw `${response.status} ${response.statusText}`
    })
        .then(function (data) {
            // console.log(data);
            getCastShows(data, personName, e);
        })
        .catch(function (error) {
            console.log("There are some Errors in person", error);
        })

}

let isDivOpen = 0;
let theBody = document.getElementsByTagName("body")[0];
theBody.addEventListener("click", () =>{
    if (isDivOpen == 1){
        isDivOpen = 0;
        let tempShowCastDiv = document.querySelector(".tempShowCastDiv");
        theBody.removeChild(tempShowCastDiv);
    }
})

function getCastShows(allShows, personName, e){
    isDivOpen = 1;
    let tempShowCastDiv = document.createElement("div");
    tempShowCastDiv.className = "tempShowCastDiv";
    tempShowCastDiv.style.position = "absolute";
    tempShowCastDiv.style.width = "16rem";
    tempShowCastDiv.style.left = e.x-120 + 'px';
    tempShowCastDiv.style.top = e.pageY + 'px';
    console.log("top: " + tempShowCastDiv.style.top);
    console.log("y: " + e.y);
    tempShowCastDiv.style.backgroundColor = "#e63946";
    tempShowCastDiv.style.border = "2px solid #1d3557";
    tempShowCastDiv.style.borderRadius = "15px"; 
    let h4Tag = document.createElement("h4");
    h4Tag.innerHTML = personName + " Shows: ";
    h4Tag.style.textAlign = "center";
    h4Tag.style.backgroundColor = "#a8dadc";
    tempShowCastDiv.appendChild(h4Tag);
    theBody.appendChild(tempShowCastDiv);
    allShows.forEach(element => {
        const showsUrl = element._links.show.href;
        fetch(showsUrl).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw `${response.status} ${response.statusText}`
        })
            .then(function (data) {
                const showId = data.id;
                const showName = data.name;
                let pTag = document.createElement("p");
                pTag.innerHTML = showName;
                pTag.style.cursor = "pointer";
                pTag.addEventListener("click", () =>{
                    document.querySelector(".showCastDiv").removeChild(document.querySelector(".subShowCastDiv"));
                    goEpisodes(showId);
                });
                tempShowCastDiv.appendChild(pTag);

            })
            .catch(function (error) {
                console.log("There are some Errors in person shows", error);
            })
    })
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
    document.getElementById("showsSelect").value = "";
    document.querySelector(".showCastDiv").removeChild(document.querySelector(".subShowCastDiv"));
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
    
    let newShow = allShows.find(show => show.name === selectorVal);
    goEpisodes(newShow.id);

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
    let genresShow = document.createElement("p");
    genresShow.innerHTML = "Genres: " + show.genres;
    showPropertyDiv.appendChild(genresShow);
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
    setAllEpisodes(myUrl, showId);

    
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
    
    showList.forEach(show => {
        setBoxShow(show);
    });
    
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
    
    const allShows = getAllShows();
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
