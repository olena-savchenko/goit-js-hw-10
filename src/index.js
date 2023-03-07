import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries'


const DEBOUNCE_DELAY = 300;
      // налаштування повідомлень notiflix
const notiflixOptions = {width: '330px', fontSize: '16px', position: 'center-top', timeout: 2000};


const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));


function onSearchCountry(e) {
  clearInfo();
        // // прибираємо пробіли у рядка методом trim()
  const searchQuery = e.target.value.trim();
 	
  // Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується,
  // розмітка списку країн або інформації про країну зникає.
  if (searchQuery === '') {
    clearInfo();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {

              // якщо кількість країн більше 10, то запит повинен бути специфічнішим
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name', notiflixOptions);
        return;
      }
            // якщо країн від 2 до 10, то вивести прапор і назву
      if (countries.length >= 2 && countries.length <= 10) {
        createCountriesMarkUp(countries);
        return;
      }
            // якщо 1 країна, вивести інфо про країну
      if (countries.length === 1) {
        createCountriesMarkUp(countries);
        createCountryInfo(countries);
        return;
      }
                      // у разі, якщо країну не знайдено
    }).catch(error => Notiflix.Notify.failure('Oops, there is no country with that name', notiflixOptions));
}



        // створює розмітку країн (прапор + назва)
function createCountriesMarkUp(countries) {

	const markUp = countries.map(country => {
		return `<li>
		<img src="${country.flags.svg}" width="40" >&nbsp;
    <span class="country-name">${country.name.official}<span>
		</li>`;
  }).join("");
  
  countryList.innerHTML = markUp;
}

        // створює розмітку однієї додаткової інфо про країну (столиця*населення*мови)
function createCountryInfo(country) {

  const markUpInfo = country.map(property => {
   return `<p><b>Capital: &nbsp;</b>${property.capital}</p>
		      <p><b>Population: &nbsp;</b> ${property.population}</p>
		      <p><b>Languages: &nbsp;</b> ${Object.values(property.languages).join(', ')}</p>`
  }).join("");

  countryInfo.innerHTML = markUpInfo;
}

  // очищує розмітку
function clearInfo() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
 }

