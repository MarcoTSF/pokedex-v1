const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon-image');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

const typesList = document.querySelector('.types-list');
const statHp = document.querySelector('.stat-hp');
const statAttack = document.querySelector('.stat-attack');
const statDefense = document.querySelector('.stat-defense');
const statSpeed = document.querySelector('.stat-speed');

const btnStage2 = document.querySelector('.btn-stage2');
const btnStage3 = document.querySelector('.btn-stage3');
const evolutionImage = document.querySelector('.pokemon-evolution-image');

let searchPokemon = 1;
let evolutionStages = [];

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (APIResponse.status === 200) {
        return await APIResponse.json();
    }
};

const fetchSpecies = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    if (response.status === 200) {
        return await response.json();
    }
};

const fetchEvolutionChain = async (url) => {
    const response = await fetch(url);
    if (response.status === 200) {
        return await response.json();
    }
};

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Carregando...';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);

    if (data) {
        const sprite = data.sprites.other['official-artwork'].front_default || 
                       data.sprites.front_default ||
                       data.sprites.other.dream_world.front_default ||
                       data.sprites.other.home.front_default;
    
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
    
        if (sprite) {
            pokemonImage.style.display = 'block';
            pokemonImage.src = sprite;
        } else {
            pokemonImage.style.display = 'none';
        }
    
        input.value = '';
        searchPokemon = data.id;

        renderTypes(data);
        renderStats(data);
        await renderEvolutions(data.id);

    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Pokémon inválido.';
        pokemonNumber.innerHTML = 'Erro';
    }
};

const renderTypes = (data) => {
    typesList.innerHTML = '';
    data.types.forEach(t => {
        const span = document.createElement('span');
        span.classList.add('type');
        span.textContent = t.type.name;
        typesList.appendChild(span);
    });
};

const renderStats = (data) => {
    statHp.textContent = data.stats[0].base_stat;
    statAttack.textContent = data.stats[1].base_stat;
    statDefense.textContent = data.stats[2].base_stat;
    statSpeed.textContent = data.stats[5].base_stat;
};

const renderEvolutions = async (id) => {
    evolutionStages = [];

    const species = await fetchSpecies(id);
    if (!species) return;

    const evoChainUrl = species.evolution_chain.url;
    const evoChain = await fetchEvolutionChain(evoChainUrl);

    if (!evoChain) return;

    let evoData = evoChain.chain;
    while (evoData) {
        evolutionStages.push(evoData.species.name);
        evoData = evoData.evolves_to[0];
    }

    evolutionImage.src = "#";
};

const renderEvolutionStage = async (stageIndex) => {
    if (evolutionStages[stageIndex]) {
        const data = await fetchPokemon(evolutionStages[stageIndex]);
        if (data) {
            const sprite = data.sprites.other['official-artwork'].front_default;
            evolutionImage.src = sprite;
        }
    }
};

btnStage2.addEventListener('click', () => renderEvolutionStage(1));
btnStage3.addEventListener('click', () => renderEvolutionStage(2));

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    if (searchPokemon < 1025) {
        searchPokemon += 1;
        renderPokemon(searchPokemon);
    }
});

renderPokemon(searchPokemon);