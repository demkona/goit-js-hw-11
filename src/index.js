import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { getUrl } from './js/fetchSearch';
import { getDataServer } from './js/fetchSearch'

export { getDataInfo }

const loadMoreBtn = document.querySelector('.load-more');
const inputForm = document.querySelector('#search-form');
const searchGallery = document.querySelector('.gallery');

inputForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onClick);

loadMoreBtn.classList.add("is-hidden");

let searchText;
let page;
const per_page = 40;
const newCards = [];

function cleanView() {
    searchGallery.innerHTML = '';
    loadMoreBtn.classList.add("is-hidden");
    newCards.length = 0;
    return;
}

function getDataInfo(searchURL) {
    getDataServer(searchURL)
        .then(data => {
            const { hits: cardsArray, totalHits } = data;
            if (cardsArray.length === 0) {
                cleanView();
                return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again...");
            }
            if (cardsArray.length === per_page) {
                loadMoreBtn.classList.remove("is-hidden");
            }

            newCards.push(...cardsArray);
            if (newCards.length >= totalHits) {
                loadMoreBtn.classList.add("is-hidden");
                Notiflix.Notify.success(`We're sorry, but you've reached the end of search results`)
            }

            if (newCards.length <= cardsArray.length) {
                Notiflix.Notify.success(`Hooray! We found over ${totalHits} images`);
            }
            makePicturesList(newCards);
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
    page = 1;
    getUrl(searchText, page);
}

function onClick() {
    page += 1;
    getUrl(searchText, page);
}

function makePicturesList(newCards) {
    const markup = newCards.map((item) => {
        const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = item
        return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
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
};
