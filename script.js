async function carregarProjetos() {
    const container = document.getElementById("projetos");

    const { data, error } = await supabaseClient
        .from("projetos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Erro ao carregar projetos:", error);

        container.innerHTML = `
            <p>Não foi possível carregar os projetos.</p>
        `;

        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = `
            <p>Nenhum projeto cadastrado ainda.</p>
        `;

        return;
    }

    container.innerHTML = "";

    data.forEach(projeto => {
        const card = document.createElement("article");

        card.className = "projeto";

        card.innerHTML = `
            ${
                projeto.foto
                    ? `<img src="${projeto.foto}" alt="${projeto.nome}">`
                    : ""
            }

            <div class="projeto-conteudo">
                <h3>${projeto.nome}</h3>

                <p>${projeto.descricao || ""}</p>

                ${
                    projeto.link
                        ? `
                        <a href="${projeto.link}" target="_blank">
                            Ver projeto
                        </a>
                        `
                        : ""
                }
            </div>
        `;

        container.appendChild(card);
    });
}

carregarProjetos();
