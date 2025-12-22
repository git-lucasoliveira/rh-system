const API_URL = "http://localhost:8080/api"; // Ou /api se mudaste

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosUsuarioNavbar(); // <--- NOVO: Preenche a navbar
    
    if (document.getElementById("tabelaUsuariosBody")) {
        carregarUsuarios();
    }
    // ... resto do código de edição (mantém igual) ...
    const urlParams = new URLSearchParams(window.location.search);
    const idParaEditar = urlParams.get('id');
    if (idParaEditar && document.getElementById("formUsuario")) {
        carregarUsuarioParaEdicao(idParaEditar);
    }
});

// --- NOVO: Função para preencher a Navbar ---
function carregarDadosUsuarioNavbar() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        // Se não tem token, manda pro login
        window.location.href = "login.html"; 
        return;
    }

    try {
        // Decodifica o Token (Pega a parte do meio)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);

        // 1. Define o NOME (Tenta pegar 'sub' ou 'username')
        const nomeUsuario = payload.sub || payload.username || "Usuário";
        document.getElementById("usuarioLogadoNome").innerText = nomeUsuario;

        // 2. Define o PERFIL (Tenta pegar 'perfil', 'role' ou 'authority')
        // Ajuste aqui conforme o nome que está no teu Java (User ou TokenService)
        const perfilUsuario = payload.perfil || payload.role || payload.authorities;

        const badgePerfil = document.getElementById("usuarioLogadoPerfil");
        
        if (perfilUsuario) {
            badgePerfil.innerText = perfilUsuario.replace("ROLE_", ""); // Remove prefixo se houver
            badgePerfil.style.display = "inline-block"; // Mostra o badge
        } else {
            badgePerfil.style.display = "none"; // Esconde se não achar
        }

    } catch (e) {
        console.error("Erro ao processar token:", e);
        // Em caso de erro (token inválido), desloga
        logout();
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// --- Listagem (Atualizada com o Visual do Print) ---
async function carregarUsuarios() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const usuarios = await response.json();
            renderizarTabela(usuarios);
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarTabela(usuarios) {
    const tbody = document.getElementById("tabelaUsuariosBody");
    tbody.innerHTML = ""; 

    usuarios.forEach(user => {
        // Lógica de Badges VISUAL (Igual ao Print)
        let badgePerfil = "";
        
        if (user.perfil === "SUPERADMIN") {
            badgePerfil = `<span class="badge bg-warning text-dark"><i class="bi bi-stars"></i> SUPERADMIN</span>`;
        } else if (user.perfil === "TI") {
            badgePerfil = `<span class="badge bg-danger"><i class="bi bi-pc-display"></i> TI</span>`;
        } else if (user.perfil === "RH") {
            // No print era azul claro (info) e tinha texto extra
            badgePerfil = `<span class="badge bg-info text-dark"><i class="bi bi-people-fill"></i> RH (Gestão)</span>`;
        } else {
            badgePerfil = `<span class="badge bg-secondary">${user.perfil}</span>`;
        }

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
                <a href="usuario-form.html?id=${user.id}" class="btn btn-sm btn-warning text-dark" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </a>
                <button onclick="excluirUsuario(${user.id})" class="btn btn-sm btn-danger ms-1" title="Excluir">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ... Mantém as funções salvarUsuario, excluirUsuario e carregarUsuarioParaEdicao que já tinhas ...
// (Se precisares que eu as repita, avisa!)