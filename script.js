// Referencias a elementos del DOM
const cardsContainer = document.getElementById('cards-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCardsElement = document.getElementById('total-cards');
const japaneseCardsElement = document.getElementById('japanese-cards');
const koreanCardsElement = document.getElementById('korean-cards');
const totalValueElement = document.getElementById('total-value');
const collectionTotalElement = document.getElementById('collection-total');

// Variable para almacenar las cartas
let cards = [];

// Datos por defecto de las cartas (se cargan si falla el JSON)
const defaultCards = [
    { name: "Landorus", code: "sv11B 137", language: "Korean", price: 3.00, imageCode: "sv11B_137" },
    { name: "Stunfisk", code: "sv11W 115", language: "Korean", price: 1.50, imageCode: "sv11W_115" },
    { name: "Excadrill ex", code: "sv11B 163", language: "Japanese", price: 1.00, imageCode: "sv11B_163" },
    { name: "Zebstrika", code: "sv11W 112", language: "Korean", price: 2.00, imageCode: "sv11W_112" },
    { name: "Frillish", code: "sv11W 124", language: "Korean", price: 4.00, imageCode: "sv11W_124" },
    { name: "Tympole", code: "sv11B 107", language: "Japanese", price: 2.00, imageCode: "sv11B_107" },
    { name: "Cryogonal", code: "sv11B 115", language: "Korean", price: 2.50, imageCode: "sv11B_115" },
    { name: "Elgyem", code: "sv11B 126", language: "Korean", price: 3.00, imageCode: "sv11B_126" },
    { name: "Pidove", code: "sv11B 153", language: "Japanese", price: 5.50, imageCode: "sv11B_153" },
    { name: "Oryza", code: "sv11B 166", language: "Korean", price: 1.00, imageCode: "sv11B_166" },
    { name: "Timburr", code: "sv11B 131", language: "Japanese", price: 2.50, imageCode: "sv11B_131" },
    { name: "Solosis", code: "sv11B 123", language: "Japanese", price: 13.00, imageCode: "sv11B_123" },
    { name: "Vanilluxe", code: "sv11W 110", language: "Korean", price: 3.00, imageCode: "sv11W_110" },
    { name: "Dwebble", code: "sv11B 135", language: "Korean", price: 6.50, imageCode: "sv11B_135" }
];

// Función para cargar los datos de las cartas desde JSON
async function loadCardsData() {
    try {
        const response = await fetch('cards.json');
        if (!response.ok) {
            throw new Error(`Error al cargar cards.json: ${response.status}`);
        }
        cards = await response.json();
        calculateStats();
        renderCards();
    } catch (error) {
        console.error('Error cargando datos:', error);
        // Cargar datos por defecto en caso de error
        loadDefaultCards();
    }
}

// Función para cargar datos por defecto si falla la carga del JSON
function loadDefaultCards() {
    cards = [...defaultCards];
    calculateStats();
    renderCards();
}

// Función para formatear el precio
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

// Función para generar la ruta de la imagen
function getImagePath(imageCode) {
    return `images/${imageCode}.png`;
}

// Función para crear placeholder cuando la imagen falla
function createImagePlaceholder(card) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
        <div>
            <i class="fas fa-image"></i>
            <p>${card.name}</p>
            <div class="card-code">${card.code}</div>
        </div>
    `;
    return placeholder;
}

// Función para manejar errores de carga de imágenes
function handleImageError(event, card) {
    const imgElement = event.target;
    const parent = imgElement.parentElement;

    if (parent) {
        imgElement.style.display = 'none';
        const placeholder = createImagePlaceholder(card);
        parent.appendChild(placeholder);
    }
}

// Función para calcular estadísticas
function calculateStats() {
    const totalCards = cards.length;
    const japaneseCards = cards.filter(card => card.language === "Japanese").length;
    const koreanCards = cards.filter(card => card.language === "Korean").length;
    const totalValue = cards.reduce((sum, card) => sum + card.price, 0);

    totalCardsElement.textContent = totalCards;
    japaneseCardsElement.textContent = japaneseCards;
    koreanCardsElement.textContent = koreanCards;
    totalValueElement.textContent = formatPrice(totalValue);
    collectionTotalElement.textContent = formatPrice(totalValue);
}

// Función para renderizar las cartas
function renderCards(filter = 'all') {
    cardsContainer.innerHTML = '';

    const filteredCards = filter === 'all'
        ? cards
        : cards.filter(card => card.language.toLowerCase() === filter);

    filteredCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item';

        const imagePath = getImagePath(card.imageCode);

        cardElement.innerHTML = `
            <div class="card-image">
                <img src="${imagePath}" alt="${card.name}">
            </div>
            <div class="card-content">
                <div class="card-title">${card.name}</div>
                <div class="card-info">
                    <span class="language-badge ${card.language.toLowerCase()}">${card.language}</span>
                    <div class="card-price">${formatPrice(card.price)}</div>
                </div>
                <div class="card-code">${card.code}</div>
            </div>
        `;

        // Asignar el manejador de errores a la imagen
        const imgElement = cardElement.querySelector('img');
        imgElement.onerror = (event) => handleImageError(event, card);

        cardsContainer.appendChild(cardElement);
    });
}

// Función para configurar los filtros
function setupFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover la clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Agregar la clase active al botón clickeado
            button.classList.add('active');

            // Filtrar las cartas
            const filter = button.getAttribute('data-filter') || 'all';
            renderCards(filter);
        });
    });
}

// Inicializar la aplicación
async function init() {
    await loadCardsData();
    setupFilters();
}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);