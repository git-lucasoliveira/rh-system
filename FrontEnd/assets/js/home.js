document.addEventListener('DOMContentLoaded', () => {
    // 1. Segurança: Verifica se tem token
    verificarAutenticacao();
    
    // 2. Preenche o Perfil (Nome e Cargo com Bypass)
    carregarUsuarioDoToken();
    
    // 3. Carrega os números do Dashboard
    carregarEstatisticas();
});

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// --- LÓGICA DE PERFIL (Igual ao app.js) ---
function carregarUsuarioDoToken() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Decodifica o Token
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = atob(payloadBase64);
        const dadosUsuario = JSON.parse(payloadDecodificado);

        // 1. Nome
        const nomeParaMostrar = dadosUsuario.nome || dadosUsuario.sub || "Usuário";
        document.getElementById('user-name').innerText = nomeParaMostrar;

        // 2. Cargo (Role)
        let roleDisplay = "USER";
        
        // Tenta achar a role oficial
        if (dadosUsuario.role) roleDisplay = dadosUsuario.role;
        else if (dadosUsuario.authorities) roleDisplay = dadosUsuario.authorities[0];
        
        roleDisplay = roleDisplay.replace('ROLE_', '').toUpperCase();

        // --- O PULO DO GATO (BYPASS) ---
        // Se for o Lucas, vira CHEFE!
        if (nomeParaMostrar === 'lucas' || nomeParaMostrar === 'admin') {
            roleDisplay = 'SUPERADMIN';
        }

        // 3. Atualiza o Badge na tela
        const elementoRole = document.getElementById('user-role');
        if (elementoRole) {
            elementoRole.innerText = roleDisplay;
            
            // Remove classe d-none se estava escondido
            elementoRole.classList.remove('d-none');

            // Ajusta a cor conforme o cargo
            if(roleDisplay === 'SUPERADMIN') {
                elementoRole.className = 'badge bg-warning text-dark fw-bold ms-2';
            } else {
                elementoRole.className = 'badge bg-secondary text-white ms-2';
            }
        }

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
    }
}

// --- CARREGA OS NÚMEROS ---
async function carregarEstatisticas() {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const buscarDados = async (endpoint, idElemento) => {
        try {
            const res = await fetch(`http://localhost:8080/api/${endpoint}`, { headers });
            if(res.ok) {
                const lista = await res.json();
                document.getElementById(idElemento).innerText = lista.length || 0;
            } else {
                document.getElementById(idElemento).innerText = "-";
            }
        } catch {
            document.getElementById(idElemento).innerText = "0";
        }
    };

    // Busca os 3 totais em paralelo
    await Promise.all([
        buscarDados('funcionarios', 'total-funcionarios'),
        buscarDados('setores', 'total-setores'),
        buscarDados('cargos', 'total-cargos')
    ]);
}