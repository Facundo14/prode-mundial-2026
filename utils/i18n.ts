/**
 * Diccionario de traducción para los países del Mundial 2026
 * Mapea el nombre en inglés (tal como viene del JSON/DB) al español.
 */
const countryTranslations: Record<string, string> = {
  // Grupo A
  "Canada": "Canadá",
  "Togo": "Togo",
  "South Korea": "Corea del Sur",
  "Denmark": "Dinamarca",
  
  // Grupo B
  "Mexico": "México",
  "Benin": "Benín",
  "United Arab Emirates": "Emiratos Árabes",
  "Germany": "Alemania",
  
  // Grupo C
  "United States": "Estados Unidos",
  "Central African Republic": "Rep. Centroafricana",
  "Panama": "Panamá",
  "Portugal": "Portugal",
  
  // Otros países comunes en el fixture
  "Argentina": "Argentina",
  "Algeria": "Argelia",
  "Austria": "Austria",
  "Jordan": "Jordania",
  "Brazil": "Brasil",
  "France": "Francia",
  "Spain": "España",
  "Italy": "Italia",
  "Netherlands": "Países Bajos",
  "England": "Inglaterra",
  "Belgium": "Bélgica",
  "Croatia": "Croacia",
  "Uruguay": "Uruguay",
  "Colombia": "Colombia",
  "Morocco": "Marruecos",
  "Japan": "Japón",
  "Saudi Arabia": "Arabia Saudita",
  "South Africa": "Sudáfrica",
  "Czech Republic": "República Checa",
  "Switzerland": "Suiza",
  "Poland": "Polonia",
  "Sweden": "Suecia",
  "Norway": "Noruega",
  "Ukraine": "Ucrania",
  "Turkey": "Turquía",
  "Senegal": "Senegal",
  "Ghana": "Ghana",
  "Cameroon": "Camerún",
  "Ecuador": "Ecuador",
  "Peru": "Perú",
  "Chile": "Chile",
  "Australia": "Australia",
  "New Zealand": "Nueva Zelanda",
  "China": "China",
  "Iran": "Irán",
  "Iraq": "Irak",
  "Egypt": "Egipto",
  "Nigeria": "Nigeria",
  "Ivory Coast": "Costa de Marfil",
  "Tunisia": "Túnez",
  "Qatar": "Catar",
  "Oman": "Omán",
  "Uzbekistan": "Uzbekistán",
  "Honduras": "Honduras",
  "Costa Rica": "Costa Rica",
  "Jamaica": "Jamaica",
  "Paraguay": "Paraguay",
  "Venezuela": "Venezuela",
  "Bolivia": "Bolivia",
  "Greece": "Grecia",
  "Hungary": "Hungría",
  "Romania": "Rumania",
  "Scotland": "Escocia",
  "Wales": "Gales",
  "Ireland": "Irlanda",
};

/**
 * Traduce el nombre de un país al español.
 * Si no encuentra traducción, devuelve el nombre original.
 */
export function translateCountry(name: string): string {
  if (!name) return "";
  return countryTranslations[name] || name;
}
