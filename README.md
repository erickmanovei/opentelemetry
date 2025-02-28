*Configurar o Grafana:*

1- Acesse http://localhost:3001/ (usuário: admin, senha: admin).
2- Vá em Connections > Data Sources.
3- Clique em Add data source e escolha Prometheus.
4- Configure o Prometheus URL como http://prometheus:9090 e clique em Save & Test.
5- Agora vá em Dashboards > New > Import e use o ID 1860 para importar um painel de OpenTelemetry.

*Jaeger:*

1- Acessar pelo endereço: http://localhost:16686

*NGINX*

Para configurar o nginx, para o acesso ser com ssl, precisa ser via http2. Abaixo segue um exemplo de configuração:

`server {
  server_name collector.greenchat.com.br;

  location / {
    grpc_pass grpc://localhost:4317;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }


    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/collector.greenchat.com.br/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/collector.greenchat.com.br/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = collector.greenchat.com.br) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80 http2;
  server_name collector.greenchat.com.br;
    return 404; # managed by Certbot


}`
