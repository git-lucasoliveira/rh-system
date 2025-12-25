// home.js - Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // A segurança e o perfil da Navbar já foram tratados pelo app.js
    // Aqui focamos apenas no conteúdo do Dashboard
    carregarEstatisticas();
});

// --- CARREGA OS NÚMEROS ---
async function carregarEstatisticas() {
    const token = localStorage.getItem('token');
    if(!token) return; // Se não tiver token, o app.js já vai ter redirecionado

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const buscarDados = async (endpoint, idElemento) => {
        try {
            const res = await fetch(`http://localhost:8080/api/${endpoint}`, { headers });
            if(res.ok) {
                const lista = await res.json();
                const el = document.getElementById(idElemento);
                if(el) el.innerText = lista.length || 0;
            } else {
                const el = document.getElementById(idElemento);
                if(el) el.innerText = "-";
            }
        } catch {
            const el = document.getElementById(idElemento);
            if(el) el.innerText = "0";
        }
    };

    // Busca os 3 totais em paralelo
    await Promise.all([
        buscarDados('funcionarios', 'total-funcionarios'),
        buscarDados('setores', 'total-setores'),
        buscarDados('cargos', 'total-cargos')
    ]);
}