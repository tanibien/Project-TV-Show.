//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const template = document.getElementById("template");
  
  const cards = episodeList.map(episode => {
    const clone = template.content.cloneNode(true);

    const title = clone.querySelector("#title-episode");
    const image = clone.querySelector("#image");
    const summary = clone.querySelector("#summary");

    title.textContent = 
    `${episode.name} S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    image.src = episode.image.medium;
    image.alt = episode.name;
    summary.innerHTML = episode.summary;

    return clone;
  });

  const container = document.getElementById("card-container");
  container.append(...cards);
}

window.onload = setup;
