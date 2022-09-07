let indexPosition = 0;
let pokeObjects = [];
fetchPokemons(20);

async function fetchPokemons(amount) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${amount}`
    );
    const allPokemons = await response.json();
    const fetchEmAll = allPokemons.results.map((object) => fetch(object.url));
    const pokemonUrls = await Promise.all(fetchEmAll);
    const allJSON = pokemonUrls.map((res) => res.json());
    const allPokeObjects = await Promise.all(allJSON);
    pokeObjects = allPokeObjects.map((obj) => obj);
    console.log(pokeObjects);
    allPokeObjects.forEach((pokemon) => {
        renderPokemon(pokemon);
    });
    showPokemonInfo(pokeObjects, indexPosition);
}

function renderPokemon(data) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("pokemon-card");
    if (data.id === 1) {
        newDiv.classList.add("pokemon-card-selected");
    }

    const newImage = document.createElement("img");
    newImage.src = data.sprites.front_default;

    const newH3 = document.createElement("h3");
    newH3.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    newDiv.appendChild(newImage);
    newDiv.appendChild(newH3);

    document.querySelector(".pokemon-container").append(newDiv);
}

window.addEventListener("keydown", (e) => {
    const allPokemonCards = document.querySelectorAll(".pokemon-card");
    removeSelected(allPokemonCards, indexPosition);

    function addSelected() {
        allPokemonCards.forEach((card) => {
            if (
                Array.prototype.indexOf.call(allPokemonCards, card) ===
                indexPosition
            ) {
                card.classList.add("pokemon-card-selected");
            }
        });
    }
    switch (e.code) {
        case "ArrowLeft":
            indexPosition--;
            if (indexPosition < 1) {
                indexPosition = 0;
            }
            showPokemonInfo(pokeObjects, indexPosition);
            addSelected();
            break;
        case "ArrowRight":
            indexPosition++;
            if (indexPosition >= allPokemonCards.length) {
                indexPosition = allPokemonCards.length - 1;
            }
            showPokemonInfo(pokeObjects, indexPosition);
            addSelected();
            break;
        case "ArrowUp":
            e.defaultPrevented = true;
            indexPosition -= 5;
            if (indexPosition < 1) {
                indexPosition = 0;
            }
            showPokemonInfo(pokeObjects, indexPosition);
            addSelected();
            break;
        case "ArrowDown":
            e.defaultPrevented = true;
            indexPosition += 5;
            if (indexPosition >= allPokemonCards.length) {
                indexPosition = allPokemonCards.length - 1;
            }
            showPokemonInfo(pokeObjects, indexPosition);
            addSelected();
            break;
    }
});

function removeSelected(arr, index) {
    arr.forEach((card) => {
        if (card.classList.contains("pokemon-card-selected")) {
            const index = Array.prototype.indexOf.call(arr, card);
            indexPosition = index;
        }
        card.classList.remove("pokemon-card-selected");
    });
}

function showPokemonInfo(arr, index) {
    document.querySelector(".ability-container").innerHTML = "";
    document.querySelector(".type-container").innerHTML = "";
    document.querySelector(".stats-container").innerHTML = "";
    // while (infoBox.firstChild){
    //     infoBox.removeChild(infoBox.firstChild)
    // }
    arr.forEach((object) => {
        if (index === arr.indexOf(object)) {
            // Name of pokemon
            document.querySelector("#pokemon-name").textContent =
                object.name.charAt(0).toUpperCase() + object.name.slice(1);
            // Pokemon Sprite
            document.querySelector("#pokemon-info-sprite").src =
                object.sprites.front_default;
            // Types
            object.types.forEach((type) => {
                const typeName =
                    object.types[object.types.indexOf(type)].type.name;
                const typeElement = document.createElement("h3");
                typeElement.classList.add("ability-name");
                typeElement.textContent = typeName;
                document
                    .querySelector(".type-container")
                    .appendChild(typeElement);
            });
            // Abilities
            object.abilities.forEach((ability) => {
                const abilityName =
                    object.abilities[object.abilities.indexOf(ability)].ability
                        .name;
                const abilityElement = document.createElement("h3");
                abilityElement.classList.add("ability-name");
                abilityElement.textContent = abilityName;
                document
                    .querySelector(".ability-container")
                    .appendChild(abilityElement);
            });
            // Stats
            object.stats.forEach((stat) => {
                const statName =
                    object.stats[object.stats.indexOf(stat)].stat.name;
                const statValue =
                    object.stats[object.stats.indexOf(stat)].base_stat;
                const statElement = document.createElement("h4");
                statElement.classList.add("stat-name");
                statElement.textContent =
                    statName.toUpperCase() + ": " + statValue;
                document
                    .querySelector(".stats-container")
                    .appendChild(statElement);
            });
        }
    });
}
