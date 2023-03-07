/*
 * Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс Country API і повертає проміс з масивом країн - результатом запиту. 
Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.
 */
export function fetchCountries(name) {
	
	return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(response.status);
			  }
			  return response.json();
		});
}