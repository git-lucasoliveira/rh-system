document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'index.html';

    carregarCargos();
});

async function carregarCargos() {
    const url = 'http://localhost:8080/api/cargos';
    const container = document.getElementById('lista-cargos');
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

    try {
        const resposta = await fetch(url, { headers });
        if (!resposta.ok) throw new Error('Erro ao buscar cargos');
        const lista = await resposta.json();
        
        container.innerHTML = "";

        if(lista.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum cargo encontrado.</p>';
            return;
        }

        lista.forEach(cargo => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card card-dashboard h-100 p-4 text-center">
                    <div class="card-icon" style="color: var(--star-gold);"><i class="bi bi-briefcase-fill"></i></div>
                    <h4 class="text-white">${cargo.nome}</h4>
                    <p class="text-muted small">ID: #${cargo.id}</p>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (erro) {
        console.error(erro);
        container.innerHTML = `<p class="text-danger">Erro de conexão.</p>`;
    }
}