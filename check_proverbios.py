import json

with open('src/assets/medite.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Pegar todos os capitulos de Proverbios
proverbios = [d for d in data if d['livro'] == 'Provérbios']

print(f'Total de capítulos de Provérbios: {len(proverbios)}\n')

for cap in proverbios[:10]:  # Mostrar os primeiros 10 para análise
    print(f'=== Provérbios {cap["capitulo"]} ===')
    for i, p in enumerate(cap['perguntas'], 1):
        print(f'  P{i}: {p["pergunta"]}')
        print(f'  R:  {p["resposta_esperada"][:100]}...' if len(p["resposta_esperada"]) > 100 else f'  R:  {p["resposta_esperada"]}')
    print()
