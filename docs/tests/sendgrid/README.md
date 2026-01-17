# Template de Email - GuildsBook

Este template HTML é usado para os emails de confirmação de conta do GuildsBook.

## Configuração do Logo

O logo está configurado para usar uma URL absoluta. Você tem duas opções:

### Opção 1: Usar URL do Servidor (Recomendado)

No template, o logo usa `{{baseUrl}}/logo.png`. Você precisa configurar a variável `baseUrl` no SendGrid ou no NextAuth.

**Para NextAuth:**
O NextAuth automaticamente disponibiliza o logo em `/logo.png` quando hospedado. Use:
```html
src="{{url}}/logo.png"
```
Onde `{{url}}` é a URL base da aplicação (ex: `https://guildsbook-production.up.railway.app`)

**Para SendGrid:**
Configure a variável `baseUrl` no SendGrid Dynamic Template:
- `baseUrl`: `https://guildsbook-production.up.railway.app`

### Opção 2: Usar Base64 (Alternativa)

Se preferir embutir o logo diretamente no HTML (não recomendado para logos grandes):

1. Converta o logo para base64:
```bash
# No terminal
base64 -i logo.png -o logo_base64.txt
```

2. Use no HTML:
```html
<img src="data:image/png;base64,SEU_CODIGO_BASE64_AQUI" ...>
```

**Nota:** Base64 aumenta significativamente o tamanho do email. Para logos, URL absoluta é melhor.

## Formato da Imagem

- **PNG funciona perfeitamente** em emails HTML
- **Não precisa converter para SVG** - PNG é amplamente suportado
- Tamanho recomendado: 150-200px de largura
- Peso recomendado: < 50KB para carregamento rápido

## Variáveis do Template

O template usa as seguintes variáveis que devem ser configuradas:

- `{{url}}` - URL do link de verificação (NextAuth)
- `{{baseUrl}}` - URL base da aplicação (para imagens)
- `{{year}}` - Ano atual (opcional, pode ser hardcoded)

## Testando o Template

1. **Localmente:** Use um serviço como Mailtrap ou configure um servidor SMTP de teste
2. **SendGrid:** Use o editor visual do SendGrid para testar o template
3. **NextAuth:** O NextAuth usa este template automaticamente quando configurado

## Cores do Tema

O template usa as cores oficiais do GuildsBook:
- Fundo principal: `#ffff96` (amarelo claro)
- Botão: `#c39738` (dourado)
- Textos: `#5e4318` (marrom escuro)
- Destaques: `#7f4311` (marrom)
