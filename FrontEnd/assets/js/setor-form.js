// setor-form.js - Cadastro e Edição de Setores
const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Verifica se é edição
    const params = new URLSearchParams(window.location.search);
    const idEdicao = params.get('id');

    if (idEdicao) {
        carregarDadosEdicao(idEdicao, token);
    }

    const form = document.getElementById('formSetor');
    if (form) {
        form.addEventListener('submit', (e) => salvarSetor(e, idEdicao, token));
    }
});

async function carregarDadosEdicao(id, token) {
    const titulo = document.getElementById('tituloFormulario');
    if (titulo) titulo.innerHTML = '<i class="bi bi-buildings-fill text-info"></i> Editar Setor';

    try {
        const res = await fetch(`${API_URL}/setores/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const setor = await res.json();
            document.getElementById('setorId').value = setor.id;
            document.getElementById('nome').value = setor.nome;
        } else {
            mostrarMensagem('Erro ao carregar dados do setor', 'danger');
        }
    } catch (e) {
        console.error(e);
        mostrarMensagem('Erro de conexão', 'danger');
    }
}

async function salvarSetor(e, idEdicao, token) {
    e.preventDefault();

    const btn = document.getElementById('btn-salvar');
    setButtonLoading(btn, true);

    const setor = {
        nome: document.getElementById('nome').value
    };

    let url = `${API_URL}/setores`;
    let metodo = 'POST';

    if (idEdicao) {
        url = `${API_URL}/setores/${idEdicao}`;
        metodo = 'PUT';
        setor.id = idEdicao;
    }

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(setor)
        });

        if (res.ok) {
            showSuccess('Setor salvo com sucesso!');
            setTimeout(() => window.location.href = 'setores.html', 1500);
        } else {
            showError('Erro ao salvar setor');
            setButtonLoading(btn, false);
        }
    } catch (erro) {
        console.error(erro);
        showError('Erro de conexão');
        setButtonLoading(btn, false);
    }
}
