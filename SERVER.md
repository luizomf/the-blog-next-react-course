# Servidor

Meu servidor: Usando Google Cloud Platform VM + Imagem Ubuntu 24.04 amd64

Os requisitos para deploy vão ser:

- Um servidor linux com IP válido que não mude, com acesso SSH (vou usar Ubuntu
  24.04 na Google Cloud Platform)
- Um domínio que você possa configurar registros de DNS (Registro tipo A já
  funciona)

O Comando SSH para entrar no servidor

```sh
ssh usuario@ip_ou_dominio_do_servidor
```

Atualizando os pacotes no servidor:

```sh
sudo apt update -y
sudo apt upgrade -y
```

Meu servidor já estava com o git instalado, se precisar: `sudo apt install git`.
Depois disso vamos configurar uma chave ssh para o servidor se comunicar com o
nosso github.

Git

```sh
ssh-keygen # (enter, enter, enter)
cat .ssh/id_ed25519.pub # (copia a chave e coloca nas suas chaves ssh do github)
git clone ENDERECO_SSH NOME_DA_PASTA
```

NVM + Node

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# Sair e entrar novamente para atualizar as variáveis
nvm install --lts
node --version # só para conferir
npm -g install npm@latest
```

Comandos para iniciar o site do zero:

```sh
cd theblog
# Ter o node instalado
# Instalar todos os pacotes
npm i
# Configure o .env.local
npm run migrate
npm run seed # Seed é opcional

# build do next
npm run build
npm start # apenas para teste
```

Sua senha

```sh
# NO SEU COMPUTADOR, COLOQUE A SENHA NO generate-hashed-password.ts
npx tsx src/utils/generate-hashed-password.ts
# APAGUE A SENHA E SALVE O ARQUIVO
```

Configurando o .env.local

```sh
# DICA: é mais fácil editar esse arquivo no seu computador e colar no servidor
cd pasta_do_projeto
cp .env-example .env.local
nano .env.local
# Ajuste variáveis de ambiente se precisar (ctrl + o / ctrl + x)
```

Se estiver tudo certo, podemos rodar uma build para teste

```sh
cd pasta_do_projeto
npm run  build
npm start
```

Se rodou tudo bonitinho, vamos para o Nginx

```sh
sudo apt install nginx -y  # Só isso já deve subir algo na porta 80
```

Configurando para por 80 - (Meu domínio: theblog.otaviomiranda.com.br)

```sh
sudo nano /etc/nginx/sites-available/theblog.otaviomiranda.com.br
```

Edita os dados abaixo:\
`theblog.otaviomiranda.com.br`\
Se você mudou a porta da aplicação, mude `3000` para o número que escolheu.
Também ajuste os caminhos `/home/luizotavio/theblog/public/` e
`/home/luizotavio/theblog/public/uploads/`

```
server {
  listen 80;
  server_name theblog.otaviomiranda.com.br;

  # Desativa buffer pra suportar Streaming e Suspense do Next.js
  proxy_buffering off;
  proxy_set_header X-Accel-Buffering no;

  # Servir arquivos estáticos do /public
  location /public/ {
    alias /home/luizotavio/theblog/public/;
  }

  # Servir arquivos estáticos do /public
  location /uploads/ {
    alias /home/luizotavio/theblog/public/uploads/;
  }

  # Resto do tráfego passa pro app Node (Next.js)
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Permitir WebSocket (caso use algum no futuro)
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /_next/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Salva o arquivo (ctrl + o / ctrl + x) e vamos criar um link simbólico para a
pasta sites-enabled (é ela que ativa os sites):

```sh
sudo rm /etc/nginx/sites-enabled/default # Apaga o site default que o nginx ativou
sudo ln -s /etc/nginx/sites-available/theblog.otaviomiranda.com.br /etc/nginx/sites-enabled/
sudo nginx -t # confere se está tudo certo
sudo systemctl reload nginx
```

Agora bora instalar o certbot para quem tem domínio (não vai funcionar se tu não
tem domínio)

```sh
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d theblog.otaviomiranda.com.br
sudo nginx -t # confere se tá tudo certo
sudo systemctl reload nginx
```

Eu tive alguns problemas de permissões quando fiz a configuração, tive que dar
permissão pastas da raiz até a pasta uploads, assim (mas teste primeiro para
saber se precisa). O mais simples mesmo é mudar o usuário do Nginx de www-data
para seu nome de usuário:

```sh
sudo chmod o+x /home # primeiro na home (até chegar em uploads)
sudo chmod o+x /home/luizotavio
sudo chmod o+x /home/luizotavio/theblog
sudo chmod o+x /home/luizotavio/theblog/public
# só aqui fiz recursão para evitar mudar todos os arquivos do projeto
sudo chmod -R o+rx /home/luizotavio/theblog/public/uploads
```

Agora vamos usar o pm2 para manter o app sempre aberto e iniciando junto com o
sistema caso a gente reinicie.

```sh
npm install -g pm2
pm2 start npm --name theblog -- start #
pm2 save
pm2 startup # Copia e cola o resultado desse comando e dápressiona ENTER
pm2 save # só pra garantir

# Ver
pm2 list # listar
pm2 restart theblog # reinicia
pm2 stop theblog # para
pm2 start theblog # inicia
pm2 log theblog # veja o log do next (importante para debug)

# O sqlite não lida muito bem cluster (várias instâncias do node rodando ao mesmo tempo)
# mas se você trocar de base de dados, para postgreSQL, MySQL, etc, use os comandos abaixo:
pm2 delete theblog # reinicia
pm2 start npm --name theblog -- start -i max # modo cluster, 1 instância por core do processador
pm2 save
```

Depoois de fazer todas as configurações, meu arquivo final do NGINX ficou assim:

```
#############################################
# BLOCO HTTPS – Site principal (porta 443) #
#############################################

server {
  server_name theblog.otaviomiranda.com.br;

  # (opcional) Define o caminho raiz do projeto – Next.js não usa diretamente, mas não atrapalha
  root /home/luizotavio/theblog;

  # Desativa buffer de proxy – necessário para funcionar corretamente o Streaming e Suspense no Next.js
  proxy_buffering off;
  proxy_set_header X-Accel-Buffering no;

  # --- SEGURANÇA BÁSICA ---

  # Oculta a versão do NGINX no header "Server"
  server_tokens off;

  # Bloqueia acesso a arquivos ocultos (ex: .env, .git, etc)
  location ~ /\. {
    deny all;
  }

  # Bloqueia acesso a arquivos sensíveis por extensão
  location ~* \.(sql|bak|zip|tar|gz|env|log)$ {
    deny all;
  }

  # Permite apenas métodos HTTP comuns (evita ataque com métodos como DELETE, OPTIONS, etc)
  if ($request_method !~ ^(GET|POST|HEAD)$ ) {
    return 444;
  }

  # Headers de segurança
  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options SAMEORIGIN;
  add_header X-XSS-Protection "1; mode=block";
  charset utf-8;

  # --- LOGS ---
  access_log /var/log/nginx/theblog.access.log;
  error_log /var/log/nginx/theblog.error.log;

  # --- GZIP ---
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

  # --- ROTAS DO NEXT.JS ---

  # SOMENTE os IPs abaixo podem acessar /admin
  location /admin {
    allow 123.123.123.123; # IP permitido
    allow 123.123.123.124; # IP permitido
    allow 192.168.0.0/24; # Rede inteira permitida
    allow 187.108.118.0/24; # Rede inteira permitida
    deny all;

    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  # Arquivos internos do Next.js (chunks, css, etc)
  location /_next/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Arquivos públicos acessíveis diretamente, como imagens
  location /public/ {
    alias /home/luizotavio/theblog/public/;
  }

  # Pasta de uploads – acessível diretamente. IMPORTANTE: qualquer rota "/uploads" do Next será ignorada
  location /uploads/ {
    alias /home/luizotavio/theblog/public/uploads/;
  }

  # Todas as outras rotas passam para o servidor Next.js (SSR)
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Suporte a WebSocket (caso use no futuro)
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  # --- HTTPS (SSL) ---
  listen 443 ssl; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/theblog.otaviomiranda.com.br/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/theblog.otaviomiranda.com.br/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

#############################################
# BLOCO HTTP – Redirecionamento (porta 80) #
#############################################

server {
  # Redireciona todo tráfego HTTP para HTTPS
  if ($host = theblog.otaviomiranda.com.br) {
    return 301 https://$host$request_uri;
  } # managed by Certbot

  listen 80;
  server_name theblog.otaviomiranda.com.br;
  return 404; # fallback se algo passar sem redirecionar
}
```

Se quiser fazer um scriptzinho besta que faz pull automaticamente no seu
servidor pra você e já reinicia os servidores:

```sh
nano ~/refresh-theblog.sh
```

Cola isso no arquivo ajustando os caminhos para seu servidor

```sh
#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "cd /home/luizotavio/theblog"
cd /home/luizotavio/theblog
echo

echo "Executando: git pull origin main"
git pull origin main
echo

echo "Executando: npm run build"
npm run build

echo "Executando: pm2 restart theblog"
pm2 restart theblog
echo

echo "sudo systemctl restart nginx"
sudo systemctl restart nginx
echo
```

Salve com ctrl + o / ctrl + x \
Mude as permissões do arquivo para permitir execução

```sh
sudo chmod +x ~/refresh-theblog.sh
```

Agora, do seu computador você pode executar o seguinte comando mudando os dados
para o seu servidor (usuário, domínio ou ip, nome do arquivo):

```sh
ssh luizotavio@theblog.otaviomiranda.com.br './refresh-theblog.sh'
```

Esse comando entra na pasta do projeto, executa "git pull" para puxar as
alterações do github, reinicia o pm2 e o nginx. As alterações já devem estar
visíveis se não houve nenhum erro. Sempre que fizer alterações no projeto,
testar bonitinho e fizer o push para o github, roda o comando e ele atualiza o
site para você.

Se o timezone do servidor estiver incorreto, você pode conferir com o comando:

```sh
timedatectl # Confira seu timezone atual. Meu:  Time zone: Etc/UTC (UTC, +0000)
# encontre seu timezone, abaixo estou buscando por America/Sao_Paulo
timedatectl list-timezones | grep Sao_Paulo # Saída: America/Sao_Paulo (Nome preciso)
sudo timedatectl set-timezone America/Sao_Paulo # Altere
timedatectl # Confira - Time zone: America/Sao_Paulo (-03, -0300)
```
