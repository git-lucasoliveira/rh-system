/**
 * APP.JS - Global (Navbar, Segurança e Logout)
 */

document.addEventListener("DOMContentLoaded", () => {
    // Ignora lógica nas telas de login
    const path = window.location.pathname;
    if (path.includes('login.html') || path.includes('index.html')) {
        return;
    }

    carregarNavbar();
});

async function carregarNavbar() {
    const placeholder = document.getElementById("nav-placeholder");
    if (placeholder) {
        try {
            // Busca o arquivo navbar.html na mesma pasta
            const response = await fetch('navbar.html');
            if (response.ok) {
                placeholder.innerHTML = await response.text();
                // Só roda a segurança depois que a navbar existir no HTML
                verificarAcessoGlobal();
                configurarLogout();
            }
        } catch (e) { console.error("Erro navbar:", e); }
    } else {
        verificarAcessoGlobal();
        configurarLogout();
    }
}

function verificarAcessoGlobal() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html"; // Ajustado para index.html
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Define o Nome
        const nomeUser = payload.nome || payload.sub || "Usuário";
        
        // --- CORREÇÃO DA LEITURA DO PERFIL ---
        // O teu console mostrou que a chave é 'perfil' e o valor é 'RH'
        let role = payload.perfil || payload.role || "USER";

        // Garante que é string e maiúsculo
        role = String(role).replace('ROLE_', '').toUpperCase();

        // Bypass Lucas
        if (nomeUser === 'lucas' || nomeUser === 'admin') role = 'SUPERADMIN';

        console.log("Perfil Detectado JS:", role); // Veja este log no F12

        atualizarNavbar(nomeUser, role);
        controlarPermissoesMenu(role);

    } catch (e) {
        console.error("Erro token:", e);
        logoutSistema();
    }
}

function atualizarNavbar(nome, role) {
    // ... código do nome ...

    const roleEl = document.getElementById("usuarioLogadoPerfil");
    if (roleEl) {
        roleEl.innerText = role;
        roleEl.style.display = "inline-block";
        roleEl.className = "badge ms-1"; 

        if (role === 'SUPERADMIN') {
            roleEl.classList.add('bg-warning', 'text-dark');
        } else if (role === 'TI') {
            roleEl.classList.add('bg-danger');
        } else if (role === 'RH') { // <--- Verifique se este IF existe
            roleEl.classList.add('bg-info', 'text-dark');
        } else {
            roleEl.classList.add('bg-secondary');
        }
    }
}

function controlarPermissoesMenu(role) {
    if (role !== 'SUPERADMIN') {
        // Remove itens do menu se não for chefe
        const idsParaEsconder = ["nav-item-usuarios", "nav-item-logs", "nav-divider"];
        idsParaEsconder.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }
}

function configurarLogout() {
    const btnSair = document.getElementById("btnSair");
    if (btnSair) {
        btnSair.addEventListener("click", (e) => {
            e.preventDefault();
            logoutSistema();
        });
    }
}

function logoutSistema() {
    localStorage.removeItem("token");
    // MUDANÇA AQUI: Aponta para o arquivo real do teu login
    window.location.href = "index.html"; 
}

function irParaLogin() {
    // MUDANÇA AQUI TAMBÉM
    window.location.href = "index.html";
}