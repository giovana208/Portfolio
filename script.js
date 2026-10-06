async function carregarProjetos() {

    const { data, error } = await supabaseClient
        .from("projetos")
        .select("*");

    if (error) {
        console.error("Erro ao buscar projetos:", error);

        document.getElementById("projetos").innerHTML =
            "<p>Não foi possível carregar os projetos.</p>";

        return;
    }

    const container = document.getElementById("projetos");

    container.innerHTML = "";

    data.forEach(projeto => {

        const card = document.createElement("div");

        card.className = "projeto";

        card.innerHTML = `
            <h3>${projeto.nome}</h3>

            <p>
                ${projeto.descricao || ""}
            </p>

            ${
                projeto.link
                ? `<a href="${projeto.link}" target="_blank">
                    Ver projeto
                   </a>`
                : ""
            }
        `;

        container.appendChild(card);
    });
}

carregarProjetos();
