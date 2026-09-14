import json
import re
from collections import Counter

# Palavras comuns que NÃO são nomes bíblicos (para filtrar falsos positivos)
PALAVRAS_COMUNS = {
    'De', 'Do', 'Da', 'Dos', 'Das', 'Em', 'No', 'Na', 'Nos', 'Nas',
    'Por', 'Para', 'Com', 'Sem', 'Que', 'Qual', 'Quais', 'Quando',
    'Como', 'Onde', 'Quem', 'Deus', 'Jesus', 'Cristo', 'Senhor', 'Jeová',
    'Bíblia', 'Israel', 'Terra', 'Deus', 'Espírito', 'Santo', 'Pai',
    'Filho', 'Rei', 'Rainha', 'Profeta', 'Sacerdote', 'Juiz', 'Juízes',
    'Livro', 'Lei', 'Aliança', 'Palavra', 'Povo', 'Nação', 'Tribo',
    'Templo', 'Tabernáculo', 'Arca', 'Altar', 'Monte', 'Rio', 'Mar',
    'Céu', 'Terra', 'Morte', 'Vida', 'Paz', 'Guerra', 'Batalha',
    'Anjo', 'Demônio', 'Satanás', 'Diabo', 'Faraó', 'César',
    'Novo', 'Velho', 'Grande', 'Pequeno', 'Primeiro', 'Último',
    'São', 'Santa', 'Igreja', 'Evangelho', 'Graça', 'Fé', 'Amor',
    'Homem', 'Mulher', 'Filho', 'Filha', 'Pai', 'Mãe', 'Irmão',
    'Apóstolo', 'Discípulo', 'Mestre', 'Escriba', 'Fariseu', 'Levita',
    'Egito', 'Babilônia', 'Assíria', 'Roma', 'Grécia', 'Pérsia',
    'Canaã', 'Jordão', 'Sinai', 'Sião', 'Jerusalém', 'Belém', 'Nazaré',
    'Antigo', 'Testamento', 'Escrituras', 'Hebraicas', 'Gregas',
    'Cristãs', 'Sagradas', 'Tradução', 'Mundo',
    # Verbos e outros que às vezes aparecem capitalizados
    'Disse', 'Fez', 'Foi', 'Era', 'Tinha', 'Veio',
}

files = {
    'quiz.json':            'src/assets/quiz.json',
    'pistas.json':          'src/assets/pistas.json',
    'perguntas_revelar.json': 'src/assets/perguntas_revelar.json',
    'medite.json':          'src/assets/medite.json',
}

def extrair_texto(obj):
    """Recursivamente extrai todo o texto de um objeto JSON"""
    textos = []
    if isinstance(obj, str):
        textos.append(obj)
    elif isinstance(obj, list):
        for item in obj:
            textos.extend(extrair_texto(item))
    elif isinstance(obj, dict):
        for v in obj.values():
            textos.extend(extrair_texto(v))
    return textos

nomes_encontrados = Counter()
nomes_por_arquivo = {}

for nome_arquivo, caminho in files.items():
    try:
        with open(caminho, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        textos = extrair_texto(data)
        texto_total = ' '.join(textos)
        
        # Encontrar palavras que começam com letra maiúscula (possíveis nomes próprios)
        palavras = re.findall(r'\b[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙÇ][a-záéíóúâêîôûãõàèìòùç]{2,}\b', texto_total)
        
        nomes_arquivo = set()
        for palavra in palavras:
            if palavra not in PALAVRAS_COMUNS and len(palavra) > 2:
                nomes_encontrados[palavra] += 1
                nomes_arquivo.add(palavra)
        
        nomes_por_arquivo[nome_arquivo] = sorted(nomes_arquivo)
        print(f'[{nome_arquivo}]: {len(nomes_arquivo)} nomes candidatos encontrados')
    
    except FileNotFoundError:
        print(f'[{nome_arquivo}]: arquivo não encontrado')

print('\n' + '='*60)
print('TOP 200 NOMES MAIS FREQUENTES NO APP')
print('='*60)
for nome, freq in nomes_encontrados.most_common(200):
    print(f'{freq:4d}x  {nome}')
