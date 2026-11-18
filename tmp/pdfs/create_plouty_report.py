from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, PageTemplate, Paragraph,
    Spacer, Table, TableStyle, HRFlowable,
)


ROOT = Path(r"C:\Users\Usuario\Documents\Projetos Programação\Plouty-Connecting")
OUTPUT = ROOT / "output" / "pdf" / "relatorio_tecnico_plouty.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

pdfmetrics.registerFont(TTFont("ArialCustom", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialCustomBold", r"C:\Windows\Fonts\arialbd.ttf"))
pdfmetrics.registerFontFamily("ArialCustom", normal="ArialCustom", bold="ArialCustomBold")

FOREST = colors.HexColor("#173524")
GREEN = colors.HexColor("#2f6b42")
CREAM = colors.HexColor("#f4f1e8")
INK = colors.HexColor("#17231c")
MUTED = colors.HexColor("#526258")
BORDER = colors.HexColor("#d8d5cb")
LIGHT = colors.HexColor("#e9f1e9")
AMBER = colors.HexColor("#8c5925")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="TitleCustom", fontName="ArialCustomBold", fontSize=23,
    leading=27, textColor=FOREST, spaceAfter=10,
))
styles.add(ParagraphStyle(
    name="SubtitleCustom", fontName="ArialCustom", fontSize=10.5,
    leading=15, textColor=MUTED, spaceAfter=16,
))
styles.add(ParagraphStyle(
    name="SectionCustom", fontName="ArialCustomBold", fontSize=13.2,
    leading=16, textColor=FOREST, spaceBefore=15, spaceAfter=7,
    keepWithNext=True,
))
styles.add(ParagraphStyle(
    name="BodyCustom", fontName="ArialCustom", fontSize=9.1,
    leading=13.4, textColor=INK, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="SmallCustom", fontName="ArialCustom", fontSize=7.8,
    leading=11.2, textColor=MUTED, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="BulletCustom", parent=styles["BodyCustom"],
    leftIndent=13, firstLineIndent=-9, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="TableHeadCustom", fontName="ArialCustomBold", fontSize=8.2,
    leading=11, textColor=colors.white,
))
styles.add(ParagraphStyle(
    name="TableBodyCustom", fontName="ArialCustom", fontSize=8,
    leading=11.4, textColor=INK,
))
styles.add(ParagraphStyle(
    name="CalloutCustom", fontName="ArialCustomBold", fontSize=9.2,
    leading=13, textColor=FOREST,
))


def P(text, style="BodyCustom"):
    return Paragraph(text, styles[style])


def section(title):
    story.append(P(title, "SectionCustom"))


def para(text):
    story.append(P(text))


def bullets(items):
    for item in items:
        story.append(P("&#8226; " + item, "BulletCustom"))


def table(headers, rows, widths):
    data = [[P(escape(h), "TableHeadCustom") for h in headers]]
    data += [[P(c, "TableBodyCustom") for c in row] for row in rows]
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), FOREST),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7f8f5")]),
        ("GRID", (0, 0), (-1, -1), 0.35, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))


PAGE_W, PAGE_H = 595.28, 841.89  # A4
MARGIN_X = 43


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, PAGE_H - 50, PAGE_W, 50, fill=1, stroke=0)
    canvas.setFillColor(FOREST)
    canvas.rect(0, PAGE_H - 53, PAGE_W, 3, fill=1, stroke=0)
    canvas.setFont("ArialCustomBold", 9.4)
    canvas.drawString(MARGIN_X, PAGE_H - 31, "PLOUTY  /  RELATÓRIO TÉCNICO")
    canvas.setFont("ArialCustom", 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 31, "17 NOV 2026")
    canvas.setStrokeColor(BORDER)
    canvas.line(MARGIN_X, 40, PAGE_W - MARGIN_X, 40)
    canvas.setFont("ArialCustom", 7.7)
    canvas.drawString(MARGIN_X, 27, "Análise do repositório local - commit e26cc1b")
    canvas.drawRightString(PAGE_W - MARGIN_X, 27, f"Página {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT), pagesize=(PAGE_W, PAGE_H),
    leftMargin=MARGIN_X, rightMargin=MARGIN_X,
    topMargin=72, bottomMargin=58,
    title="Relatório técnico - Plouty", author="Codex",
)
frame = Frame(MARGIN_X, 58, PAGE_W - 2 * MARGIN_X, PAGE_H - 130,
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates(PageTemplate(id="report", frames=frame, onPage=draw_page))

story = []
story.append(P("Relatório técnico do projeto Plouty", "TitleCustom"))
story.append(P(
    "Inventário do código, estado das funcionalidades, problemas confirmados e prioridades para a finalização do protótipo.",
    "SubtitleCustom",
))
story.append(HRFlowable(width="100%", thickness=1, color=BORDER, spaceAfter=13))
story.append(P(
    "<b>Escopo e método.</b> Revisão estática dos arquivos versionados na branch main, commit e26cc1b de 08/10/2026. "
    "As constatações de comportamento se apoiam no código; não houve inspeção visual em navegador nesta etapa. "
    "O último build, executado na conversa anterior sobre esta revisão, passou. Nenhum arquivo de código foi alterado para este relatório.",
    "SmallCustom",
))

section("1. Objetivo e público-alvo")
para(
    "A Plouty é um protótipo acadêmico da FIAP alinhado à ODS 2 - Fome Zero e Agricultura Sustentável. "
    "Busca aproximar pequenos produtores rurais e cooperativas de compradores institucionais, como escolas, hospitais e restaurantes. "
    "A experiência apresenta descoberta de fornecedores, reputação, demandas de compra e comunicação. O README identifica o projeto como demonstrativo."
)

section("2. Tecnologias e arquitetura")
table(["Camada", "Implementação atual"], [
    ["Interface", "React 18, React DOM, Bootstrap 5, Bootstrap Icons e SCSS."],
    ["Build e navegação", "Vite 6 e React Router 7."],
    ["Estado", "Context API para tema e perfil demonstrativo; estado local nos componentes."],
    ["Dados", "Módulos JavaScript com perfis, posts, demandas e conversas fictícias em src/data/."],
    ["Persistência", "sessionStorage para o perfil; localStorage para tema, publicações e demandas."],
    ["Servidor e banco", "Não existem no repositório."],
], [117, 392])
para(
    "A aplicação é uma SPA executada no navegador. src/App.jsx concentra rotas, cabeçalho, painel de mensagens e navegação móvel. "
    "src/context/WorkspaceContext.jsx controla o perfil escolhido, sem autenticação ou autorização de servidor."
)
story.append(Spacer(1, 8))
story.append(P("Panorama da implementação", "SectionCustom"))
table(["Indicador", "Estado no código"], [
    ["Conteúdo de exemplo", "6 fornecedores, 4 demandas, 3 posts e 6 conversas divididas entre os dois perfis."],
    ["Rotas de produto", "/inicio, /demandas e /explorar exigem apenas a sessão demonstrativa no navegador."],
    ["Integração de dados", "Nenhuma API ou banco; ações de negócio permanecem simuladas ou locais."],
], [117, 392])

section("3. Estrutura de pastas e arquivos")
table(["Local", "Responsabilidade"], [
    ["public/", "Logos, favicon, imagem institucional e pastas sociais ainda sem as imagens referenciadas."],
    ["src/components/", "Componentes comuns, demandas, exploração, layout, perfil e feed social."],
    ["src/context/", "Sessão demonstrativa e tema claro/escuro."],
    ["src/data/", "Conteúdo fictício da interface."],
    ["src/hooks/", "Validação do contato, foco em diálogos e consulta de largura de tela."],
    ["src/pages/", "Entrada, início, demandas, exploração, sobre e contato."],
    ["src/styles/", "Tokens, layout, componentes e estilos de páginas em SCSS."],
    ["src/utils/", "Leitura e gravação segura em localStorage."],
    ["Raiz", "App.jsx, main.jsx, index.html, package.json, vite.config.js, vercel.json e README."],
], [117, 392])

section("4. Páginas, rotas e funcionalidades")
table(["Rota", "Acesso", "O que existe"], [
    ["/ e /entrar", "Público", "Escolha de papel, validação local de e-mail e senha e entrada demonstrativa."],
    ["/inicio", "Sessão", "Feed com três posts fictícios; criação de post com texto ou imagem; comentários e ações locais."],
    ["/demandas", "Sessão", "Quatro demandas fictícias, busca, filtros, criação local, interesse e botão de negociação."],
    ["/explorar", "Sessão", "Seis fornecedores fictícios, busca, filtros, salvamento visual e botão de contato."],
    ["/sobre", "Público", "Apresentação institucional, problema, proposta e ODS 2."],
    ["/contato", "Público", "Formulário validado localmente, sem envio."],
], [83, 66, 360])
para(
    "As rotas de produto redirecionam para a entrada quando não há sessão. O painel de mensagens traz três conversas fictícias por perfil; "
    "mensagens digitadas permanecem apenas no estado da aplicação."
)

section("5. Identidade visual e responsividade")
para(
    "A paleta combina verde agrícola, superfícies creme e acentos terrosos. No tema claro, os principais tokens são "
    "verde escuro #173524, verde de ação #2f6b42, fundo #f4f1e8 e superfície #fffdf8. "
    "Há tokens próprios para modo escuro e integração com variáveis do Bootstrap. Cards arredondados, badges de verificação e ícones "
    "compõem a linguagem visual."
)
para(
    "O SCSS prevê navegação inferior abaixo de 992 px, filtros de produtores em gaveta abaixo de 768 px, "
    "mensagens em modal abaixo de 1180 px e rearranjos no feed e nas páginas públicas. Há regras para área segura do celular, "
    "foco por teclado e preferência por movimento reduzido. A qualidade visual final ainda requer revisão em navegador."
)
bullets([
    "<b>Mídias ausentes:</b> avatars/, covers/ e posts/ contêm apenas .gitkeep; os caminhos usados pelos dados levam a fallbacks ou placeholders.",
    "<b>Post só de texto:</b> SocialPost renderiza FeedMedia mesmo sem imagem, exibindo um placeholder desnecessário.",
    "<b>Tema escuro:</b> chips de produtos em demandas usam as classes fixas bg-light e text-dark.",
])

section("6. Funcionalidades: efetivas, parciais e simuladas")
para(
    "<b>Efetivas no navegador:</b> alternância de tema, sessão demonstrativa, filtros, validação do formulário, "
    "criação local de posts e demandas, pré-visualização de imagem, comentários locais e compartilhamento por Web Share ou área de transferência."
)
bullets([
    "E-mail e senha são validados apenas por formato e comprimento. Qualquer combinação válida permite entrar.",
    "Curtidas, republicações, comentários, interesses, perfis salvos e solicitações de conexão dependem de estado local e se perdem ao recarregar.",
    "O contato de um fornecedor abre a lista de conversas, sem selecionar o fornecedor; indicadores de não lida não são atualizados ao abrir uma conversa.",
    "O contato não envia mensagens. Negociar / Enviar Proposta não cria proposta nem negociação real.",
    "Reputação, documentos, entregas e notificações são dados fixos; não existem cadastro, páginas próprias de perfil, pedidos ou contratos completos.",
])

section("7. Integrações, APIs e banco de dados")
para(
    "Não há chamadas fetch, cliente HTTP, API própria, serviço de autenticação ou banco de dados. "
    "As integrações externas são links para o pitch no YouTube e links mailto:. A aplicação usa APIs do navegador para "
    "arquivos, armazenamento e compartilhamento. Imagens anexadas viram Data URLs; não há upload para servidor."
)

section("8. Bugs e riscos técnicos encontrados")
table(["Tema", "Evidência e efeito"], [
    ["Negociação direcionada", "As quatro businessKey de src/data/demandsData.js têm zero correspondências nas seis conversas de messagesData.js. O painel abre sem selecionar o contato."],
    ["Permissão por papel", "src/pages/Demandas.jsx exibe DemandCreator para ambos os perfis. Um produtor pode criar uma demanda descrita como institucional."],
    ["Retorno após entrada", "A rota protegida registra retorno, mas src/pages/Entrar.jsx sempre navega para /inicio."],
    ["Falha de gravação", "src/utils/storage.js retorna false se localStorage falhar; os fluxos de post e demanda ignoram o resultado e mostram confirmação."],
    ["Dados entre perfis", "As chaves locais de posts e demandas não incluem o papel. Trocar de perfil no mesmo navegador mantém o conteúdo anterior visível."],
    ["Datas fixas", "Posts marcados Hoje/Ontem e disponibilidade de agosto/setembro de 2026 são textos estáticos, agora desatualizados."],
    ["Toast no celular", "O toast fica a 22 px da base e sua camada é superior à navegação móvel de ao menos 66 px, podendo cobrir os botões."],
    ["Documentação", "O README lista imagens, comentários e compartilhamento como atuais e, em outra seção, como futuros; informa persistência dos comentários, que ficam apenas em estado."],
], [125, 384])
para(
    "<b>Desempenho:</b> não há gargalo de cálculo evidente nos conjuntos pequenos. O último build gerou cerca de 365 KB de CSS e "
    "291 KB de JavaScript antes de gzip. Bootstrap, ícones e páginas entram no carregamento inicial. "
    "Data URLs no localStorage podem atingir a cota do navegador após poucas imagens. Não houve medição de tempo de carregamento ou Lighthouse."
)

section("9. Build e configuração de deploy")
para(
    "O último npm.cmd run build passou com 79 módulos transformados, na mesma revisão. O Git estava limpo. "
    "O build não foi refeito nesta etapa para preservar o código. O package.json tem scripts dev, build e preview, mas não tem teste nem lint. "
    "vercel.json contém fallback da SPA para index.html e cabeçalhos básicos de segurança. "
    "Não há CI, variáveis de ambiente exigidas ou evidência de implantação ativa no repositório."
)

section("10. Pendências e sugestões por prioridade")
table(["Nível", "Trabalho", "Por quê"], [
    ["P1", "Corrigir a relação entre demandas, fornecedores e conversas; definir quem pode criar demanda.", "Ações centrais prometem um fluxo que não acontece."],
    ["P1", "Adicionar as mídias esperadas ou assumir placeholders; ocultar mídia em posts só de texto.", "Impacto visual amplo na demonstração."],
    ["P1", "Corrigir feedback de persistência e retorno após entrada.", "Evita confirmação incorreta e perda de contexto."],
    ["P2", "Revisar tema escuro, toast e telas reais; atualizar datas fictícias.", "Consistência visual e credibilidade."],
    ["P2", "Alinhar README e textos da interface; decidir separação dos dados locais por perfil.", "Escopo claro para avaliadores e usuários."],
    ["P2", "Adicionar verificação automatizada dos fluxos críticos e lint.", "Reduz regressões na finalização."],
    ["P3", "Backend, autenticação, banco, upload, mensagens reais, propostas e contratos.", "Necessários para operação além do protótipo."],
    ["P3", "Medir carregamento e avaliar divisão do bundle e estratégia de imagens.", "Otimização guiada por dados."],
], [53, 251, 205])

story.append(Spacer(1, 10))
story.append(P(
    "<b>Síntese.</b> A base visual e a navegação estão estruturadas, e o build funciona. Para finalizar a demonstração, "
    "o maior ganho está em alinhar as ações ao resultado prometido, resolver as mídias ausentes e validar as telas em tema claro, escuro e celular.",
    "CalloutCustom",
))

section("Referências principais no código")
story.append(P(
    "src/App.jsx; src/context/WorkspaceContext.jsx; src/pages/Entrar.jsx; src/pages/SocialHome.jsx; "
    "src/pages/Demandas.jsx; src/pages/Explorar.jsx; src/components/layout/MessagePanel.jsx; "
    "src/components/social/SocialPost.jsx; src/components/demands/DemandCreator.jsx; "
    "src/components/demands/DemandCard.jsx; src/data/; src/styles/; src/utils/storage.js; "
    "package.json; vite.config.js; vercel.json; readme.md.",
    "SmallCustom",
))

doc.build(story)
print(OUTPUT)
