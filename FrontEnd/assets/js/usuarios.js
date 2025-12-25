const API_URL = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Se estiver na Tabela (Lista)
    if (document.getElementById("tabelaUsuariosBody")) {
        carregarUsuarios();
    }

    // 2. Se estiver no Formulário (Edição/Criação)
    const form = document.getElementById("formUsuario");
    if (form) {
        // Verifica se é edição (tem ID na URL)
        const params = new URLSearchParams(window.location.search);
        const idEdicao = params.get('id');
        
        if (idEdicao) {
            carregarDadosEdicao(idEdicao);
        }

        form.addEventListener("submit", (e) => salvarUsuario(e, idEdicao));
    }
});

// --- LISTAGEM ---
async function carregarUsuarios() {
    const token = localStorage.getItem("token");
    if (!token) return; 

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const usuarios = await response.json();
            renderizarTabela(usuarios);
        }
    } catch (error) { console.error("Erro:", error); }
}

function renderizarTabela(usuarios) {
    const tbody = document.getElementById("tabelaUsuariosBody");
    tbody.innerHTML = ""; 

    usuarios.forEach(user => {
        let badgePerfil = "";
        const perfil = user.perfil ? user.perfil.toUpperCase().replace("ROLE_", "") : "USER";

        if (perfil === "SUPERADMIN") badgePerfil = `<span class="badge bg-warning text-dark"><i class="bi bi-stars"></i> SUPERADMIN</span>`;
        else if (perfil === "TI") badgePerfil = `<span class="badge bg-danger"><i class="bi bi-pc-display"></i> TI</span>`;
        else if (perfil === "RH") badgePerfil = `<span class="badge bg-info text-dark"><i class="bi bi-people-fill"></i> RH</span>`;
        else badgePerfil = `<span class="badge bg-secondary">${perfil}</span>`;

        const badgeStatus = user.ativo 
            ? '<span class="badge border border-success text-success bg-success bg-opacity-10">ATIVO</span>' 
            : '<span class="badge border border-danger text-danger bg-danger bg-opacity-10">INATIVO</span>';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-muted">${user.id}</td>
            <td class="fw-bold text-white">${user.login}</td>
            <td>${badgePerfil}</td>
            <td>${badgeStatus}</td>
            <td class="text-end">
                <a href="usuario-form.html?id=${user.id}" class="btn btn-sm btn-warning text-dark" title="Editar"><i class="bi bi-pencil-square"></i></a>
                <button onclick="excluirUsuario(${user.id})" class="btn btn-sm btn-danger ms-1" title="Excluir"><i class="bi bi-trash-fill"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- FORMULÁRIO (SALVAR/EDITAR) ---
async function carregarDadosEdicao(id) {
    const token = localStorage.getItem("token");
    const titulo = document.getElementById("tituloFormulario");
    if(titulo) titulo.innerHTML = '<i class="bi bi-pencil-square text-warning"></i> Editar Acesso';

    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if(res.ok) {
            const user = await res.json();
            document.getElementById("login").value = user.login;
            // Senha geralmente não vem do backend por segurança, deixa em branco para não alterar
            
            // Ajusta perfil
            const perfil = user.perfil ? user.perfil.replace("ROLE_", "") : "";
            document.getElementById("perfil").value = perfil;
        }
    } catch(e) { console.error(e); }
}

async function salvarUsuario(e, idEdicao) {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const btn = document.getElementById("btn-salvar");
    setButtonLoading(btn, true);

    const usuario = {
        login: document.getElementById("login").value,
        senha: document.getElementById("senha").value,
        perfil: document.getElementById("perfil").value
    };

    let url = `${API_URL}/usuarios`;
    let method = "POST";

    if (idEdicao) {
        url = `${API_URL}/usuarios/${idEdicao}`;
        method = "PUT";
        // Se a senha estiver vazia na edição, remove do objeto (depende do backend aceitar isso)
        if(!usuario.senha) delete usuario.senha; 
    }

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        });

        if (res.ok) {
            showSuccess('Usuário salvo com sucesso!');
            setTimeout(() => window.location.href = "usuarios.html", 1500);
        } else {
            showError('Erro ao salvar usuário');
            setButtonLoading(btn, false);
        }
    } catch (error) {
        console.error(error);
        showError('Erro de conexão');
        setButtonLoading(btn, false);
    }
}

async function excluirUsuario(id) {
    showConfirmModal(
        'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
        async () => {
            const token = localStorage.getItem("token");
            
            try {
                const res = await fetch(`${API_URL}/usuarios/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (res.ok) {
                    showSuccess('Usuário excluído com sucesso!');
                    carregarUsuarios();
                } else {
                    showError('Erro ao excluir usuário');
                }
            } catch (e) {
                console.error(e);
                showError('Erro de conexão');
            }
        },
        'Excluir Usuário'
    );
}