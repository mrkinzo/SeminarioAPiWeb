async function buscarPersonagem(nome) {
  // Tratamento da URL para codificar espaços e caracteres especiais
  const url = `https://starwars-databank-server.onrender.com/api/v1/characters/name/${encodeURIComponent(nome)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const personagens = await response.json();

    if (!personagens || personagens.length === 0) {
      console.log(`Nenhum personagem encontrado com o nome "${nome}".`);
      return;
    }

    // A API retorna uma lista com os resultados correspondentes
    personagens.forEach(personagem => {
      console.log(`=== ${personagem.name} ===`);
      console.log(`ID: ${personagem._id}`);
      console.log(`Descrição: ${personagem.description}`);
      console.log(`Foto: ${personagem.image}\n`);
    });

  } catch (erro) {
    console.error("Falha ao consultar a API:", erro.message);
  }
}

// Executando a busca
buscarPersonagem("Luke Skywalker");