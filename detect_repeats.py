import json
from collections import defaultdict

with open('src/assets/medite.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Agrupar capítulos por livro
livros = defaultdict(list)
for cap in data:
    livros[cap['livro']].append(cap)

print('DETECTANDO PERGUNTAS REPETIDAS POR LIVRO\n')
print('(Quando a mesma pergunta aparece em 3+ capítulos do mesmo livro, é cópia)\n')

livros_com_problema = []

for livro, capitulos in sorted(livros.items()):
    if len(capitulos) < 3:
        continue  # Livros muito curtos não vale verificar

    # Para cada posição de pergunta (0-4), ver se o texto é repetido
    perguntas_por_posicao = defaultdict(list)
    
    for cap in capitulos:
        for i, p in enumerate(cap['perguntas']):
            # Normaliza: remove número do capítulo da pergunta para comparar
            texto_normalizado = p['pergunta']
            for num in range(1, 151):
                texto_normalizado = texto_normalizado.replace(str(num), 'X')
            perguntas_por_posicao[i].append(texto_normalizado)
    
    # Verificar se alguma posição tem muitas repetições
    problemas = []
    for pos, perguntas in perguntas_por_posicao.items():
        # Contar duplicatas
        freq = defaultdict(int)
        for p in perguntas:
            freq[p] += 1
        
        mais_comum = max(freq.values())
        total = len(perguntas)
        
        if mais_comum >= 3 and mais_comum / total > 0.5:
            problemas.append(f'  ⚠ Pergunta {pos+1}: "{list(freq.keys())[list(freq.values()).index(mais_comum)][:60]}..." repetida {mais_comum}x de {total} caps')
    
    if problemas:
        livros_com_problema.append(livro)
        print(f'❌ {livro} ({len(capitulos)} capítulos):')
        for p in problemas:
            print(p)
        print()

print('='*60)
print(f'RESUMO: {len(livros_com_problema)} livros com perguntas repetidas:')
for l in livros_com_problema:
    print(f'  - {l}')
