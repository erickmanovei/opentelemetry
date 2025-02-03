*Configurar o Grafana:*

1- Acesse http://localhost:3001/ (usuário: admin, senha: admin).
2- Vá em Connections > Data Sources.
3- Clique em Add data source e escolha Prometheus.
4- Configure o Prometheus URL como http://prometheus:9090 e clique em Save & Test.
5- Agora vá em Dashboards > New > Import e use o ID 1860 para importar um painel de OpenTelemetry.

*Jaeger:*

1- Acessar pelo endereço: http://localhost:16686
