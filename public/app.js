const categorySelect = document.getElementById("categorySelect");
const disciplineContainer = document.getElementById("disciplineFilters");

const countrySelect = document.getElementById("country");
const regionSelect = document.getElementById("region");
const communeSelect = document.getElementById("commune");

const kidsCheckbox = document.getElementById("kidsCheckbox");
const adultsCheckbox = document.getElementById("adultsCheckbox");

const searchBtn = document.getElementById("searchBtn");
const cardsContainer = document.getElementById("cards");

const filterBtn = document.getElementById("openFilters");
const filterToggleBtn = document.getElementById("filterToggleBtn");
const openFiltersBtn = document.getElementById("openFilters");
const filtersPanel = document.querySelector(".filters");
const overlay = document.getElementById("overlay");
const closeFiltersBtn = document.getElementById("closeFiltersBtn");

document.addEventListener("DOMContentLoaded", async () => {

    await loadCategories();
    await loadCountries();
    await loadRegions(1);
    await loadCommunes(1);

    searchClubs();
});

/* ===========================
   LOADERS
=========================== */

async function loadCategories() {
    const res = await fetch("/categories");
    const categories = await res.json();

    categorySelect.innerHTML = "";

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });

    await loadDisciplines(categorySelect.value);
}

async function loadDisciplines(categoryId) {
    const res = await fetch(`/disciplines/${categoryId}`);
    const disciplines = await res.json();

    disciplineContainer.innerHTML = "";

    disciplines.forEach(d => {
        const label = document.createElement("label");
        label.innerHTML = `
            <input type="checkbox" value="${d.id}" class="discipline-checkbox">
            ${d.name}
        `;
        disciplineContainer.appendChild(label);
    });
}

async function loadCountries() {
    const res = await fetch("/countries");
    const countries = await res.json();

    countries.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        countrySelect.appendChild(option);
    });
}

async function loadRegions(countryId) {
    const res = await fetch(`/regions/${countryId}`);
    const regions = await res.json();
    regionSelect.innerHTML = "";

    regions.forEach(r => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.name;
        regionSelect.appendChild(option);
    });
}

async function loadCommunes(regionId) {
    const res = await fetch(`/communes/${regionId}`);
    const communes = await res.json();
    communeSelect.innerHTML = "";

    communes.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        communeSelect.appendChild(option);
    });
}

/* ===========================
   EVENTS
=========================== */

categorySelect.addEventListener("change", async () => {
    await loadDisciplines(categorySelect.value);
});

countrySelect.addEventListener("change", async () => {
    await loadRegions(countrySelect.value);
    await loadCommunes(regionSelect.value);
});

regionSelect.addEventListener("change", async () => {
    await loadCommunes(regionSelect.value);
});

searchBtn.addEventListener("click", searchClubs);

/* ===========================
   SEARCH
=========================== */

function getSelectedDisciplines() {
    const checkboxes = document.querySelectorAll(".discipline-checkbox:checked");
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

async function searchClubs() {

    const filters = {
        category: categorySelect.value,
        disciplines: getSelectedDisciplines(),
        country: countrySelect.value,
        region: regionSelect.value,
        commune: communeSelect.value,
        adults: adultsCheckbox.checked,
        kids: kidsCheckbox.checked
    };

    const res = await fetch("/clubs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });

    const clubs = await res.json();
    renderClubs(clubs);
}

/* ===========================
   RENDER
=========================== */

function renderClubs(clubs) {
    cardsContainer.innerHTML = "";

    clubs.forEach(club => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${club.image_url}" />
            <div class="card-body">
                <h3>${club.title}</h3>
                <p>${club.subtitle}</p>
                <p>${club.schedule}</p>
                <p><strong>${club.category_name}</strong> - ${club.discipline_name}</p>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}



/* ===========================
   Ventana Filtros
=========================== */




if (filterBtn) {
    filterBtn.addEventListener("click", () => {
        filtersPanel.classList.toggle("active");
    });
}

function openFilters() {
    filtersPanel.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeFilters() {
    filtersPanel.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// Abrir panel
if (openFiltersBtn) {
    openFiltersBtn.addEventListener("click", openFilters);
}

// Cerrar con botón
if (closeFiltersBtn) {
    closeFiltersBtn.addEventListener("click", closeFilters);
}

// Cerrar tocando overlay
if (overlay) {
    overlay.addEventListener("click", closeFilters);
}

// Cerrar al buscar
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        searchClubs();
        closeFilters();
    });
}