document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
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

async function carregarEstatisticas() {
    const token = localStorage.getItem('token');
    
    // Headers com o Token (Igual fizemos no app.js)
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        // 1. Busca Funcionários
        fetch('http://localhost:8080/api/funcionarios', { headers })
            .then(res => res.json())
            .then(lista => {
                // Atualiza o número na tela (se a lista existir)
                document.getElementById('total-funcionarios').innerText = lista.length || 0;
            })
            .catch(() => document.getElementById('total-funcionarios').innerText = "Err");

        // 2. Busca Setores
        fetch('http://localhost:8080/api/setores', { headers })
            .then(res => res.json())
            .then(lista => {
                document.getElementById('total-setores').innerText = lista.length || 0;
            })
            .catch(() => document.getElementById('total-setores').innerText = "Err");

        // 3. Busca Cargos (AGORA ATIVO)
        fetch('http://localhost:8080/api/cargos', { headers })
            .then(res => res.json())
            .then(lista => {
                document.getElementById('total-cargos').innerText = lista.length || 0;
            })
            .catch(() => document.getElementById('total-cargos').innerText = "0");

    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
    }
}