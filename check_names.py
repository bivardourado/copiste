import json
import re

# Lista de nomes ERRADOS → CORRETO (padrão TNM 2015)
CORRECOES_TNM = {
    # Já corrigido antes
    'Nimrode': 'Ninrode',
    # Nomes que costumam aparecer errados
    'Noemi': 'Noemi',       # OK na TNM
    'Jeoiada': 'Jeoiada',   # Verificar — pode ser Joiada
    'Jeosafá': 'Jeosafá',   # OK
    'Jeorão': 'Jeorão',     # OK
    'Jeoás': 'Jeoás',       # OK
    'Robão': 'Roboão',      # Verificar
    'Robão': 'Roboão',
    'Jeroboão': 'Jeroboão', # OK
    'Naama': 'Naamã',
    'Hama': 'Hamã',
    'Balao': 'Balaão',
    'Balão': 'Balaão',
    'Absalao': 'Absalão',
    'Sansao': 'Sansão',
    'Jefta': 'Jefté',
    'Gibeao': 'Gibeão',
    'Siquem': 'Siquém',
    'Betania': 'Betânia',
    'Nineive': 'Nínive',
}

# Busca contexto de um nome nos arquivos
files = {
    'quiz.json':            'src/assets/quiz.json',
    'pistas.json':          'src/assets/pistas.json',
    'perguntas_revelar.json': 'src/assets/perguntas_revelar.json',
}

# Nomes para checar se aparecem no formato errado
SUSPEITOS = [
    ('Nimrode', 'Ninrode'),
    ('Noemi', 'Noemi'),       # TNM usa Noemi? Verificar
    ('Jeoiada', 'Joiada'),    # TNM usa Joiada
    ('Roboao', 'Roboão'),
    ('Jefta', 'Jefté'),
    ('Nineive', 'Nínive'),
    ('Balao', 'Balaão'),
    ('Sansao', 'Sansão'),
    ('Absalao', 'Absalão'),
    ('Betania', 'Betânia'),
    ('Gibeao', 'Gibeão'),
    ('Gersom', 'Gérson'),
    ('Elifaz', 'Elifaz'),     # OK
    ('Golias', 'Golias'),     # TNM usa Golias ou Golias? 
    ('Calebe', 'Calebe'),     # OK na TNM
    ('Naam', 'Naamã'),
    ('Obede', 'Obede'),       # OK
    ('Seba', 'Sabá'),         # TNM usa Sabá
    ('Elia', 'Elias'),
]

print('VERIFICANDO NOMES SUSPEITOS NOS ARQUIVOS...\n')
for errado, correto in SUSPEITOS:
    for nome_arq, caminho in files.items():
        try:
            with open(caminho, 'r', encoding='utf-8') as f:
                texto = f.read()
            
            # Busca case-insensitive
            pattern = r'\b' + errado + r'\b'
            matches = list(re.finditer(pattern, texto, re.IGNORECASE))
            
            if matches:
                if errado.lower() == correto.lower():
                    status = '✓ OK'
                else:
                    status = f'⚠ VERIFICAR → correto seria: {correto}'
                print(f'  [{nome_arq}] "{errado}" encontrado {len(matches)}x  {status}')
        except FileNotFoundError:
            pass

# Agora mostra todos os nomes únicos que precisam revisão manual
print('\n' + '='*60)
print('NOMES ÚNICOS ENCONTRADOS — PARA REVISÃO MANUAL')
print('(compare com a TNM 2015)')
print('='*60)

nomes_unicos = set()
for caminho in files.values():
    try:
        with open(caminho, 'r', encoding='utf-8') as f:
            texto = f.read()
        palavras = re.findall(r'\b[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙÇ][a-záéíóúâêîôûãõàèìòùç]{3,}\b', texto)
        for p in palavras:
            nomes_unicos.add(p)
    except FileNotFoundError:
        pass

# Filtra apenas nomes que parecem ser bíblicos (não palavras comuns)
nao_nomes = {
    'Quando', 'Quais', 'Quem', 'Qual', 'Como', 'Para', 'Pela',
    'Pelo', 'Pelas', 'Pelos', 'Porque', 'Foram', 'Tinha', 'Havia',
    'Depois', 'Antes', 'Ainda', 'Sempre', 'Nunca', 'Sobre', 'Pelo',
    'Cada', 'Todo', 'Toda', 'Todos', 'Todas', 'Esse', 'Esta',
    'Esse', 'Esses', 'Estas', 'Esses', 'Este', 'Aquele', 'Aquela',
    'Desse', 'Dessa', 'Nesse', 'Nessa', 'Neste', 'Nesta',
    'Sendo', 'Tendo', 'Fazendo', 'Buscando',
    'Profecia', 'Promessa', 'Aliança', 'Templo', 'Cidade',
    'Povo', 'Nação', 'Tribo', 'Sacerdote', 'Profeta', 'Levita',
    'Praga', 'Milagre', 'Parábola', 'Batismo', 'Batista',
    'Cristão', 'Discípulo', 'Apóstolo', 'Evangelista',
    'Ressurreição', 'Exílio', 'Cativeiro', 'Libertação',
    'Pecado', 'Perdão', 'Graça', 'Fidelidade', 'Misericórdia',
    'Festividade', 'Páscoa', 'Pentecostes', 'Tabernáculos',
    'Apresenta', 'Demonstra', 'Destaca', 'Evidencia', 'Reafirma',
    'Descreve', 'Incentiva', 'Garante', 'Transmitiu', 'Condena',
    'Recomenda', 'Confirmar', 'Estabelecem', 'Exercer', 'Aceitar',
    'Permanecer', 'Permaneceu', 'Ocorreu', 'Criador', 'Reino',
    'Vermelho', 'Vale', 'Pacto', 'Lugar', 'Cidade', 'Todo', 'Minha',
    'Minha', 'Nela', 'Nele', 'Dela', 'Dele', 'Criador', 'Cont',
    'Atua', 'Exige', 'Buscar', 'Manter', 'Revela', 'Mostra',
    'Quantos', 'Quantas', 'Prometida', 'Criador', 'Agindo',
}

nomes_biblicos = sorted([n for n in nomes_unicos if n not in nao_nomes and len(n) > 3])
for nome in nomes_biblicos:
    print(nome)
