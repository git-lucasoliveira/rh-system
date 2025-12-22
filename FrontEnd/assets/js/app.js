document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o usuário tem o crachá (Token)
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html'; // Chuta para o login se não tiver token
        return;
    }

    carregarDados();
});

async function carregarDados() {
    const url = 'http://localhost:8080/api/funcionarios';
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');

    // Mostra loading
    if(statusMsg) {
        statusMsg.classList.remove('d-none');
        statusMsg.innerHTML = '<div class="spinner-border text-light" role="status"></div><p class="text-muted mt-2">A autenticar...</p>';
    }
    
    if(container) container.innerHTML = ""; 

    try {
        // 2. RECUPERA O TOKEN
        const token = localStorage.getItem('token');

        // 3. O PULO DO GATO: Envia o cabeçalho Authorization
        const headers = {
            'Authorization': `Bearer ${token}`, // Atenção ao espaço depois de Bearer
            'Content-Type': 'application/json'
        };

        console.log("Enviando Token para o Java:", token); // Para debug

        // 4. Faz a chamada com os headers
        const resposta = await fetch(url, { headers: headers });

        // Se o token estiver vencido ou inválido (Erro 401 ou 403)
        if (resposta.status === 401 || resposta.status === 403) {
            alert("Sessão expirada. Faça login novamente.");
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        if (!resposta.ok) throw new Error('Erro ' + resposta.status);

        const listaDePessoas = await resposta.json();
        
        // Esconde loading
        if(statusMsg) statusMsg.classList.add('d-none');

        mostrarNaTela(listaDePessoas);

    } catch (erro) {
        console.error(erro);
        if(statusMsg) statusMsg.innerHTML = `<p class="text-danger"><i class="bi bi-exclamation-triangle"></i> Falha: ${erro.message}</p>`;
    }
}

function mostrarNaTela(lista) {
    const container = document.getElementById('conteudo-principal');

    if(lista.length === 0){
        container.innerHTML = '<div class="col-12 text-center text-muted">Nenhum tripulante encontrado.</div>';
        return;
    }

    lista.forEach(pessoa => {
        // Lógica dos cards (igual ao que já tinhas)
        const statusBadge = pessoa.ativo 
            ? '<span class="badge bg-success bg-opacity-25 text-success border border-success">ATIVO</span>' 
            : '<span class="badge bg-danger bg-opacity-25 text-danger border border-danger">INATIVO</span>';

        const coluna = document.createElement('div');
        coluna.className = 'col-md-4 col-lg-3'; 

        coluna.innerHTML = `
            <div class="card card-dashboard h-100 p-4">
                <div class="card-body text-center">
                    <div class="card-icon"><i class="bi bi-person-fill"></i></div>
                    <h5 class="card-title fw-bold text-white">${pessoa.nome}</h5>
                    <p class="card-text text-muted small mb-2">${pessoa.email}</p>
                    <div class="mb-3"><span class="badge bg-light text-dark">${pessoa.setor || 'Geral'}</span></div>
                    ${statusBadge}
                </div>
            </div>
        `;
        container.appendChild(coluna);
    });
}