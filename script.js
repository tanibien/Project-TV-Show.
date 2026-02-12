//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const template = document.getElementById("template");
  const container = document.getElementById("card-container");
  
  container.innerHTML = "";

  const cards = episodeList.map(episode => {
    const clone = template.content.cloneNode(true);

    const title = clone.querySelector(".title-episode");
    const image = clone.querySelector(".image-display");
    const summary = clone.querySelector(".summary-text");

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    title.innerHTML = `<a href="${episode.url}" target="_blank">${episode.name} - ${episodeCode}</a>`;
    
    image.src = episode.image ? episode.image.medium : "https://via.placeholder.com/210x295";
    image.alt = episode.name;
    
    summary.innerHTML = episode.summary;

    return clone;
  });

  container.append(...cards);
}

window.onload = setup;