async function fazerLogin(event) {
    event.preventDefault(); // Não recarrega a página

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    const msgErro = document.getElementById('msg-erro');
    // Seleciona o botão de submit dentro do formulário
    const btn = event.target.querySelector('button[type="submit"]');

    // 1. URL de Login
    const url = 'http://localhost:8080/api/auth/login'; 

    // UI: Bloqueia botão, mostra loading e limpa erro
    msgErro.classList.add('d-none');
    const textoOriginal = btn.innerHTML; // Guarda o texto original do botão
    btn.innerHTML = '<div class="spinner-border spinner-border-sm"></div> Entrando...';
    btn.disabled = true;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Atenção: As chaves 'login' e 'senha' devem ser iguais às do teu DTO em Java
            body: JSON.stringify({ login: email, senha: senha }) 
        });

        if (!resposta.ok) throw new Error('Credenciais Inválidas');

        const dados = await resposta.json();

        // 2. SUCESSO: Salva o Token
        if (dados.token) {
            localStorage.setItem('token', dados.token);
            // Salva também o nome do utilizador se vier na resposta (opcional)
            if(dados.nome) localStorage.setItem('usuarioNome', dados.nome);
        }

        // 3. Redireciona para a Home
        window.location.href = 'home.html';

    } catch (erro) {
        console.error(erro);
        msgErro.classList.remove('d-none');
        
        // CORREÇÃO AQUI: Usamos innerHTML para manter o ícone do Bootstrap
        msgErro.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> Falha no login: Verifique seus dados.';
        
        // Restaura o botão
        btn.innerHTML = 'ENTRAR NO SISTEMA';
        btn.disabled = false;
    }
}