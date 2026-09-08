const API_URL = "https://starwars-databank-server.onrender.com/api/v1/characters";

let todosPersonagens = [];

// Elementos do DOM
const inputNome = document.getElementById("input-nome");
const selectCategoria = document.getElementById("select-categoria");
const gridContainer = document.getElementById("personagens-grid");
const loadingDiv = document.getElementById("loading");

// Busca TODAS as páginas de personagens da API
async function carregarPersonagens() {
    try {
        loadingDiv.classList.remove("hidden");
        
        let paginaAtual = 1;
        let totalPaginas = 1;
        todosPersonagens = [];

        // Loop que percorre todas as páginas existentes na API
        do {
            loadingDiv.textContent = `Carregando personagens... (Página ${paginaAtual})`;
            
            const resposta = await fetch(`${API_URL}?page=${paginaAtual}&limit=50`);
            const dados = await resposta.json();

            // Adiciona os personagens da página atual ao array global
            const personagensDaPagina = dados.data || [];
            todosPersonagens = todosPersonagens.concat(personagensDaPagina);

            // Descobre quantas páginas existem no total
            totalPaginas = dados.info ? dados.info.pages : 1;
            paginaAtual++;

        } while (paginaAtual <= totalPaginas);

        // Exibe todos os personagens carregados
        renderizarPersonagens(todosPersonagens);

    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
        gridContainer.innerHTML = "<p style='color: red; text-align: center;'>Erro ao carregar os dados da API.</p>";
    } finally {
        loadingDiv.classList.add("hidden");
    }
}

// Desenha os cards na tela
function renderizarPersonagens(lista) {
    gridContainer.innerHTML = "";

    if (lista.length === 0) {
        gridContainer.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>Nenhum personagem encontrado.</p>";
        return;
    }

    lista.forEach(personagem => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${personagem.image || 'https://via.placeholder.com/250x250?text=Sem+Imagem'}" alt="${personagem.name}">
            <div class="card-content">
                <h3>${personagem.name}</h3>
                <p>${personagem.description || 'Sem descrição disponível.'}</p>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

// Filtro combinado de busca
function filtrarPersonagens() {
    const termoNome = inputNome.value.toLowerCase().trim();
    const termoCategoria = selectCategoria.value.toLowerCase().trim();

    const personagensFiltrados = todosPersonagens.filter(personagem => {
        const nomeMatch = personagem.name.toLowerCase().includes(termoNome);
        const descricaoTexto = (personagem.description || "").toLowerCase();
        const categoriaMatch = termoCategoria === "" || descricaoTexto.includes(termoCategoria);

        return nomeMatch && categoriaMatch;
    });

    renderizarPersonagens(personagensFiltrados);
}

// Eventos de escuta
inputNome.addEventListener("input", filtrarPersonagens);
selectCategoria.addEventListener("change", filtrarPersonagens);

// Executa a busca completa ao iniciar a aplicação
carregarPersonagens();