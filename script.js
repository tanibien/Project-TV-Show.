//You can edit ALL of the code here
async function setup() {
  const showSelector = document.getElementById("show-selector");

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error("API Error");
    const allShows = await response.json();

    allShows.sort((a, b) =>
      a.name.localeCompare(b.name, { sensitivity: "base" }),
    );

    allShows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelector.appendChild(option);
    });
    console.log("Shows loaded successfully!");
  } catch (error) {
    console.error("Ошибка при загрузке шоу:", error);
    alert("Не удалось загрузить список сериалов. Проверь консоль браузера.");
  }

  showSelector.addEventListener("change", (e) => {
    if (e.target.value) {
      loadEpisodesForShow(e.target.value);
    }
  });

  document
    .getElementById("search-input")
    .addEventListener("input", filterEpisodes);
  document
    .getElementById("episode-selector")
    .addEventListener("change", selectSingleEpisode);
}

function makePageForEpisodes(episodeList) {
  const template = document.getElementById("template");
  const container = document.getElementById("card-container");

  container.innerHTML = "";

  const cards = episodeList.map((episode) => {
    const clone = template.content.cloneNode(true);

    const title = clone.querySelector(".title-episode");
    const image = clone.querySelector(".image-display");
    const summary = clone.querySelector(".summary-text");

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const episodeCode = `S${season}E${number}`;

    title.innerHTML = `<a href="${episode.url}" target="_blank">${episode.name} - ${episodeCode}</a>`;

    image.src = episode.image
      ? episode.image.medium
      : "https://via.placeholder.com/210x295";
    image.alt = episode.name;

    summary.innerHTML = episode.summary;

    return clone;
  });

  container.append(...cards);
}

const episodesCache = {};
let currentEpisodes = [];

async function loadEpisodesForShow(showId) {
  let episodes;

  if (episodesCache[showId]) {
    episodes = episodesCache[showId];
  } else {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`,
    );
    episodes = await response.json();
    episodesCache[showId] = episodes;
  }

  currentEpisodes = episodes;
  makePageForEpisodes(episodes);
  updateEpisodeSelector(episodes);
  updateCount(episodes.length, episodes.length);
}

function updateEpisodeSelector(episodes) {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = '<option value="">All episodes</option>';
  episodes.forEach((ep) => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;
    selector.appendChild(option);
  });
}

function filterEpisodes() {
  const term = document.getElementById("search-input").value.toLowerCase();
  const filtered = currentEpisodes.filter(
    (ep) =>
      ep.name.toLowerCase().includes(term) ||
      (ep.summary && ep.summary.toLowerCase().includes(term)),
  );
  makePageForEpisodes(filtered);
  updateCount(filtered.length, currentEpisodes.length);
}

function selectSingleEpisode(e) {
  const epId = e.target.value;
  if (!epId) {
    makePageForEpisodes(currentEpisodes);
    updateCount(currentEpisodes.length, currentEpisodes.length);
  } else {
    const selected = currentEpisodes.filter((ep) => ep.id == epId);
    makePageForEpisodes(selected);
    updateCount(selected.length, currentEpisodes.length);
  }
}

function updateCount(count, total) {
  const countDisplay = document.getElementById("results-count");
  if (countDisplay) {
    countDisplay.innerText = `Displaying ${count}/${total} episodes`;
  }
}

window.onload = setup;
