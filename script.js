const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


const yearElements = document.querySelectorAll(".current-year");

yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
});



async function carregarProjetos() {

    if (typeof supabaseClient === "undefined") {
        console.error("Supabase não foi carregado.");
        return;
    }

    const listaProjetos =
        document.querySelector("#projects-list") ||
        document.querySelector("#home-projetos");

    if (!listaProjetos) {
        return;
    }

    listaProjetos.innerHTML = `
        <p class="loading">Carregando projetos...</p>
    `;

    const { data, error } = await supabaseClient
        .from("projetos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);

        listaProjetos.innerHTML = `
            <p class="empty-message">
                Não foi possível carregar os projetos.
            </p>
        `;

        return;
    }

    if (!data || data.length === 0) {
        listaProjetos.innerHTML = `
            <p class="empty-message">
                Nenhum projeto cadastrado ainda.
            </p>
        `;

        return;
    }

    listaProjetos.innerHTML = "";

    data.forEach((projeto) => {

        const card = document.createElement("article");

        card.className = "project-card";

        const imagem = projeto.foto
            ? projeto.foto
            : "https://placehold.co/600x400/0f172a/38bdf8?text=Projeto";

        card.innerHTML = `
            <img
                src="${imagem}"
                alt="${projeto.nome || "Projeto"}"
                class="project-image"
            >

            <div class="project-content">

                <h3>
                    ${projeto.nome || "Projeto sem nome"}
                </h3>

                <p>
                    ${projeto.descricao || "Sem descrição disponível."}
                </p>

                ${
                    projeto.link
                        ? `
                            <a
                                href="${projeto.link}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="project-link"
                            >
                                Ver projeto →
                            </a>
                        `
                        : ""
                }

            </div>
        `;

        listaProjetos.appendChild(card);
    });
}



const contactForm = document.querySelector("#contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const message = document.querySelector("#contact-message");
        const button = contactForm.querySelector("button[type='submit']");

        const nome = document.querySelector("#nome")?.value.trim();
        const email = document.querySelector("#email")?.value.trim();
        const telefone = document.querySelector("#telefone")?.value.trim();
        const assunto = document.querySelector("#assunto")?.value.trim();

        if (!nome || !email || !assunto) {

            if (message) {
                message.className = "form-message error";
                message.textContent =
                    "Preencha os campos obrigatórios.";
            }

            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = "Enviando...";
        }

        const { error } = await supabaseClient
            .from("leads")
            .insert([
                {
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    assunto: assunto
                }
            ]);

        if (error) {

            console.error(error);

            if (message) {
                message.className = "form-message error";
                message.textContent =
                    "Erro ao enviar mensagem. Tente novamente.";
            }

        } else {

            if (message) {
                message.className = "form-message success";
                message.textContent =
                    "Mensagem enviada com sucesso!";
            }

            contactForm.reset();
        }

        if (button) {
            button.disabled = false;
            button.textContent = "Enviar mensagem";
        }
    });
}


const loginForm = document.querySelector("#login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.querySelector("#login-email")?.value.trim();

        const senha =
            document.querySelector("#login-senha")?.value;

        const message =
            document.querySelector("#login-message");

        const button =
            loginForm.querySelector("button[type='submit']");

        if (!email || !senha) {

            if (message) {
                message.className = "form-message error";
                message.textContent =
                    "Informe seu e-mail e sua senha.";
            }

            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = "Entrando...";
        }

        const { error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: senha
            });

        if (error) {

            console.error(error);

            if (message) {
                message.className = "form-message error";
                message.textContent =
                    "E-mail ou senha incorretos.";
            }

        } else {

            window.location.href = "painel.html";
        }

        if (button) {
            button.disabled = false;
            button.textContent = "Entrar";
        }
    });
}


async function verificarAdministrador() {

    if (!document.querySelector("#admin-projects")) {
        return;
    }

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html";
        return;
    }

    carregarProjetosAdmin();
    carregarLeads();
}



async function carregarProjetosAdmin() {

    const lista =
        document.querySelector("#admin-projects");

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<p class="loading">Carregando projetos...</p>`;

    const { data, error } = await supabaseClient
        .from("projetos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        lista.innerHTML =
            `<p class="empty-message">Erro ao carregar projetos.</p>`;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<p class="empty-message">
                Nenhum projeto cadastrado.
            </p>`;

        return;
    }

    lista.innerHTML = "";

    data.forEach((projeto) => {

        const item = document.createElement("div");

        item.className = "admin-item";

        item.innerHTML = `
            <div class="admin-item-info">

                <h3>
                    ${projeto.nome || "Sem nome"}
                </h3>

                <p>
                    ${projeto.descricao || "Sem descrição"}
                </p>

            </div>

            <button
                class="delete-button"
                onclick="excluirProjeto(${projeto.id})"
            >
                Excluir
            </button>
        `;

        lista.appendChild(item);
    });
}



const projectForm =
    document.querySelector("#project-form");

if (projectForm) {

    projectForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const nome =
            document.querySelector("#project-name")?.value.trim();

        const descricao =
            document.querySelector("#project-description")?.value.trim();

        const link =
            document.querySelector("#project-link")?.value.trim();

        const foto =
            document.querySelector("#project-photo")?.value.trim();

        const message =
            document.querySelector("#project-message");

        if (!nome) {

            if (message) {
                message.className = "form-message error";
                message.textContent =
                    "Informe o nome do projeto.";
            }

            return;
        }

        const { error } =
            await supabaseClient
                .from("projetos")
                .insert([
                    {
                        nome: nome,
                        descricao: descricao,
                        link: link,
                        foto: foto
                    }
                ]);

        if (error) {

            console.error(error);

            if (message) {
                message.className = "form-message error";
                message.textContent =
                    "Erro ao cadastrar projeto.";
            }

            return;
        }

        if (message) {
            message.className = "form-message success";
            message.textContent =
                "Projeto cadastrado com sucesso!";
        }

        projectForm.reset();

        carregarProjetosAdmin();
    });
}

async function excluirProjeto(id) {

    const confirmar =
        confirm("Deseja realmente excluir este projeto?");

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("projetos")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(error);

        alert("Não foi possível excluir o projeto.");

        return;
    }

    carregarProjetosAdmin();
}



async function carregarLeads() {

    const lista =
        document.querySelector("#admin-leads");

    if (!lista) {
        return;
    }

    lista.innerHTML =
        `<p class="loading">Carregando mensagens...</p>`;

    const { data, error } =
        await supabaseClient
            .from("leads")
            .select("*")
            .order("id", { ascending: false });

    if (error) {

        console.error(error);

        lista.innerHTML =
            `<p class="empty-message">
                Erro ao carregar mensagens.
            </p>`;

        return;
    }

    if (!data || data.length === 0) {

        lista.innerHTML =
            `<p class="empty-message">
                Nenhuma mensagem recebida.
            </p>`;

        return;
    }

    lista.innerHTML = "";

    data.forEach((lead) => {

        const item = document.createElement("div");

        item.className = "admin-item";

        item.innerHTML = `
            <div class="admin-item-info">

                <h3>
                    ${lead.nome || "Sem nome"}
                </h3>

                <p>
                    <strong>E-mail:</strong>
                    ${lead.email || "-"}
                </p>

                <p>
                    <strong>Telefone:</strong>
                    ${lead.telefone || "-"}
                </p>

                <p>
                    <strong>Assunto:</strong>
                    ${lead.assunto || "-"}
                </p>

            </div>
        `;

        lista.appendChild(item);
    });
}



const logoutButton =
    document.querySelector("#logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        await supabaseClient.auth.signOut();

        window.location.href = "login.html";
    });
}



document.addEventListener("DOMContentLoaded", () => {

    carregarProjetos();
    verificarAdministrador();

});
