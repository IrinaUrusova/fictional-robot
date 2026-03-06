# Deploy Template (почти прод)

## Быстрый старт
```bash
cd deploy-template
cp .env.prod.example .env.prod
# отредактируй пароли в .env.prod
docker compose -f docker-compose.prod.yml up -d
```

## Проверка
- Web: `http://SERVER_IP/`
- API health: `http://SERVER_IP/api/health`
- n8n: `http://SERVER_IP/n8n/`

## Остановка
```bash
docker compose -f docker-compose.prod.yml down
```
