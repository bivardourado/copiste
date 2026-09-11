import json
import re

files = [
    'src/assets/quiz.json',
    'src/assets/pistas.json',
    'src/assets/perguntas_revelar.json',
    'src/assets/medite.json'
]

words_to_check = [
    r'\bcruz\b',
    r'\binferno\b',
    r'\bjavé\b',
    r'\byahweh\b',
    r'velho testamento'
]

found_issues = []

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            for pattern in words_to_check:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    start = max(0, match.start() - 30)
                    end = min(len(content), match.end() + 30)
                    context = content[start:end].replace('\n', ' ')
                    found_issues.append(f'[{filepath}] Encontrou {match.group()} -> "...{context}..."')
    except FileNotFoundError:
        pass

if not found_issues:
    print('Nenhum problema grave encontrado na varredura básica!')
else:
    for issue in found_issues:
        print(issue)
