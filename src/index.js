
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const loadMoreBtn = document.querySelector('.load-more');
const inputForm = document.querySelector('#search-form');
const searchGallery = document.querySelector('.gallery');

let searchText = '';
let page = 1;
const per_page = 40;
const newCards = [];

loadMoreBtn.addEventListener('click', onClick);
inputForm.addEventListener('submit', onSubmit);
loadMoreBtn.classList.add("is-hidden");

function cleanView() {
    searchGallery.innerHTML = '';
    loadMoreBtn.classList.add("is-hidden");
    newCards.length = 0;
    return;
}

const getUrl = (searchText, page) => {
    const baseUrl = 'https://pixabay.com/api';
    const searchParams = new URLSearchParams({
        key: '29162129-cd407d8c81083a7eed9c52ced',
        q: searchText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
    });
    const searchURL = baseUrl + `/?${searchParams}`;
    getDataInfo(searchURL);
}
const getDataServer = async (searchURL) => {
    try {
        const response = await axios.get(searchURL);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        throw response;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}

function getDataInfo(searchURL) {
    getDataServer(searchURL)
        .then(data => {
            const { hits: cardsArray, totalHits } = data;
            newCards.push(...cardsArray);
            if (cardsArray.length === 0) {
                cleanView();
                return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again...");
            }
            if (cardsArray.length === per_page) {
                loadMoreBtn.classList.remove("is-hidden");
            }
            if (newCards.length >= totalHits) {
                loadMoreBtn.classList.add("is-hidden");
                Notiflix.Notify.success(`We're sorry, but you've reached the end of search results`)
            }
            if (newCards.length <= cardsArray.length) {
                Notiflix.Notify.success(`Hooray! We found over ${totalHits} images`);
            }
            makePicturiesList(newCards);
        })
        .catch(error => console.error(error));
}

function onSubmit(event) {
    event.preventDefault();
    cleanView();
    searchText = event.currentTarget.elements.searchQuery.value;
    if (!searchText) {
        return Notiflix.Notify.failure("Oops, there is nothing to search");
    }
    getUrl(searchText, page);
}

function onClick() {
    page += 1;
    getUrl(searchText, page);
}
function makePicturiesList(newCards) {
    const markup = newCards.map((item) => {
        return `<div class="photo-card">
        <a href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${item.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${item.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${item.downloads}</b>
          </p>
        </div>
        </div>`
    })
        .join("");

    searchGallery.innerHTML = markup;
    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: "alt",
        captionPosition: "250",
    });

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};