document.addEventListener('DOMContentLoaded', () => {
    // Verificação de Segurança (Copia para todos os arquivos)
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'index.html';

    carregarSetores();
});

async function carregarSetores() {
    const url = 'http://localhost:8080/api/setores'; // Endpoint Java
    const container = document.getElementById('lista-setores');
    
    // Configura o Token para o Backend aceitar
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

    try {
        const resposta = await fetch(url, { headers });
        if (!resposta.ok) throw new Error('Erro ao buscar setores');
        const lista = await resposta.json();
        
        container.innerHTML = ""; // Limpa

        if(lista.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum setor encontrado.</p>';
            return;
        }

        lista.forEach(setor => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card card-dashboard h-100 p-4 text-center">
                    <div class="card-icon"><i class="bi bi-buildings"></i></div>
                    <h4 class="text-white">${setor.nome}</h4>
                    <p class="text-muted small">ID: #${setor.id}</p>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (erro) {
        console.error(erro);
        container.innerHTML = `<p class="text-danger">Erro de conexão.</p>`;
    }
}