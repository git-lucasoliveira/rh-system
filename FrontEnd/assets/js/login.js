async function fazerLogin(event) {
    event.preventDefault(); // Não recarrega a página

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    const msgErro = document.getElementById('msg-erro');
    const btn = event.target.querySelector('button');

    // 1. URL de Login (Confirma se é esta no teu Java)
    const url = 'http://localhost:8080/api/auth/login'; 
    // OBS: Se não tiveres esse endpoint criado, vamos criar no próximo passo.

    // UI: Bloqueia botão e limpa erro
    msgErro.classList.add('d-none');
    btn.innerHTML = '<div class="spinner-border spinner-border-sm"></div> Entrando...';
    btn.disabled = true;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: email, senha: senha }) // Ajuste as chaves conforme seu DTO Java
        });

        if (!resposta.ok) throw new Error('Credenciais Inválidas');

        const dados = await resposta.json();

        // 2. SUCESSO: Salva o Token (Se o teu backend retornar um token)
        // Se o teu backend retornar só string, usa: localStorage.setItem('token', dados);
        if (dados.token) {
            localStorage.setItem('token', dados.token);
        }

        // 3. Redireciona para a Home
        window.location.href = 'home.html';

    } catch (erro) {
        console.error(erro);
        msgErro.classList.remove('d-none');
        msgErro.innerText = "Falha no login: Verifique seus dados.";
        
        btn.innerHTML = 'ENTRAR NO SISTEMA';
        btn.disabled = false;
    }
}