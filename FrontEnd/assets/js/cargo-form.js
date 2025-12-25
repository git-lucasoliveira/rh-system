// cargo-form.js - Cadastro e Edição de Cargos
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

    const form = document.getElementById('formCargo');
    if (form) {
        form.addEventListener('submit', (e) => salvarCargo(e, idEdicao, token));
    }
});

async function carregarDadosEdicao(id, token) {
    const titulo = document.getElementById('tituloFormulario');
    if (titulo) titulo.innerHTML = '<i class="bi bi-briefcase-fill text-warning"></i> Editar Cargo';

    try {
        const res = await fetch(`${API_URL}/cargos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const cargo = await res.json();
            document.getElementById('cargoId').value = cargo.id;
            document.getElementById('nome').value = cargo.nome;
        } else {
            mostrarMensagem('Erro ao carregar dados do cargo', 'danger');
        }
    } catch (e) {
        console.error(e);
        mostrarMensagem('Erro de conexão', 'danger');
    }
}

async function salvarCargo(e, idEdicao, token) {
    e.preventDefault();

    const btn = document.getElementById('btn-salvar');
    setButtonLoading(btn, true);

    const cargo = {
        nome: document.getElementById('nome').value
    };

    let url = `${API_URL}/cargos`;
    let metodo = 'POST';

    if (idEdicao) {
        url = `${API_URL}/cargos/${idEdicao}`;
        metodo = 'PUT';
        cargo.id = idEdicao;
    }

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cargo)
        });

        if (res.ok) {
            showSuccess('Cargo salvo com sucesso!');
            setTimeout(() => window.location.href = 'cargos.html', 1500);
        } else {
            showError('Erro ao salvar cargo');
            setButtonLoading(btn, false);
        }
    } catch (erro) {
        console.error(erro);
        showError('Erro de conexão');
        setButtonLoading(btn, false);
    }
}
