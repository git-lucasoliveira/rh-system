document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
});

async function carregarDados() {
    const url = 'http://localhost:8080/api/funcionarios';
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');

    // Mostra loading
    statusMsg.classList.remove('d-none');
    statusMsg.innerHTML = '<div class="spinner-border text-light" role="status"></div><p class="text-muted mt-2">A conectar à Nave Mãe...</p>';
    container.innerHTML = ""; // Limpa a lista anterior

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) throw new Error('Erro ' + resposta.status);

        const listaDePessoas = await resposta.json();
        
        // Esconde loading
        statusMsg.classList.add('d-none');

        mostrarNaTela(listaDePessoas);

    } catch (erro) {
        console.error(erro);
        statusMsg.innerHTML = `<p class="text-danger"><i class="bi bi-exclamation-triangle"></i> Falha na conexão: ${erro.message}</p>`;
    }
}

function mostrarNaTela(lista) {
    const container = document.getElementById('conteudo-principal');

    if(lista.length === 0){
        container.innerHTML = '<div class="col-12 text-center text-muted">Nenhum tripulante encontrado.</div>';
        return;
    }

    lista.forEach(pessoa => {
        // Formatar status (se vier booleano do Java)
        const statusBadge = pessoa.ativo 
            ? '<span class="badge bg-success bg-opacity-25 text-success border border-success">ATIVO</span>' 
            : '<span class="badge bg-danger bg-opacity-25 text-danger border border-danger">INATIVO</span>';

        // Cria a coluna do Bootstrap
        const coluna = document.createElement('div');
        coluna.className = 'col-md-4 col-lg-3'; // Responsivo (3 por linha em telas grandes)

        // O HTML DO CARD (Igual ao do Backend)
        coluna.innerHTML = `
            <div class="card card-dashboard h-100 p-4">
                <div class="card-body text-center">
                    
                    <div class="card-icon">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    
                    <h5 class="card-title fw-bold text-white">${pessoa.nome}</h5>
                    <p class="card-text text-muted small mb-2">${pessoa.email}</p>
                    
                    <div class="mb-3">
                        <span class="badge bg-light text-dark">${pessoa.setor || 'Geral'}</span>
                    </div>

                    ${statusBadge}
                </div>
            </div>
        `;

        container.appendChild(coluna);
    });
}