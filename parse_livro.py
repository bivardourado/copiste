import re
import json
import os

def parse_livro(input_file="livro.md", output_file="perguntas_revelar.json"):
    if not os.path.exists(input_file):
        print(f"Erro: Arquivo '{input_file}' não encontrado.")
        return

    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Erro ao ler o arquivo: {e}")
        return

    # Exemplo de estrutura esperada:
    # # Capítulo 1: Nome do Capítulo
    # 
    # ## Dificuldade: fácil
    # Q: Texto da pergunta?
    # R: Resposta direta
    # C: Curiosidade extra.
    
    perguntas = []
    
    # Divide o texto por capítulos
    capitulos_raw = re.split(r'^#\s+', content, flags=re.MULTILINE)[1:]
    
    pergunta_id_counter = 1
    
    for cap_index, cap_text in enumerate(capitulos_raw, start=1):
        cap_lines = cap_text.strip().split('\n')
        titulo_capitulo = cap_lines[0].strip()
        
        # Divide por nível de dificuldade ou busca direta
        dificuldades_raw = re.split(r'^##\s+', '\n'.join(cap_lines[1:]), flags=re.MULTILINE)
        
        # Se não houver divisão por ##, tenta ler as perguntas diretamente
        if len(dificuldades_raw) == 1:
            dificuldades_raw = ["Dificuldade: medio\n" + dificuldades_raw[0]]
            
        for dif_text in dificuldades_raw:
            if not dif_text.strip():
                continue
                
            dif_lines = dif_text.strip().split('\n')
            
            # Tenta extrair a dificuldade, default para 'medio'
            dificuldade = "medio"
            if dif_lines[0].lower().startswith("dificuldade:"):
                dificuldade_match = re.search(r'dificuldade:\s*(facil|medio|dificil)', dif_lines[0], re.IGNORECASE)
                if dificuldade_match:
                    dificuldade = dificuldade_match.group(1).lower()
                else:
                    # tenta achar a palavra
                    if "facil" in dif_lines[0].lower() or "fácil" in dif_lines[0].lower(): dificuldade = "facil"
                    elif "dificil" in dif_lines[0].lower() or "difícil" in dif_lines[0].lower(): dificuldade = "dificil"
            
            # Encontra blocos de Q:, R:, C:
            # Assumimos que cada pergunta começa com Q: ou Pergunta:
            blocos_perguntas = re.split(r'^(?:Q|Pergunta):', '\n'.join(dif_lines), flags=re.MULTILINE|re.IGNORECASE)[1:]
            
            for bloco in blocos_perguntas:
                # Matches Q/Pergunta, then R/Resposta, then C/Curiosidade, then optionally T/Textos and L/Link
                pergunta_match = re.match(
                    r'(.*?)(?:^R:|^Resposta:)(.*?)(?:^C:|^Curiosidade:)(.*?)(?:(?:^T:|^Textos[^\n]*:)(.*?))?(?:(?:^L:|^Link:)(.*?))?$',
                    bloco,
                    flags=re.MULTILINE | re.IGNORECASE | re.DOTALL
                )
                
                if pergunta_match:
                    pergunta_texto = pergunta_match.group(1).strip()
                    resposta_texto = pergunta_match.group(2).strip()
                    curiosidade_texto = pergunta_match.group(3).strip()
                    textos_texto = pergunta_match.group(4).strip() if pergunta_match.group(4) else ""
                    link_texto = pergunta_match.group(5).strip() if pergunta_match.group(5) else ""
                    
                    item = {
                        "id_pergunta": f"rev_{pergunta_id_counter:03d}",
                        "capitulo": cap_index,
                        "titulo_capitulo": titulo_capitulo,
                        "dificuldade": dificuldade,
                        "pergunta": pergunta_texto,
                        "resposta": resposta_texto,
                        "curiosidade_extra": curiosidade_texto
                    }
                    if textos_texto:
                        item["textosBiblicos"] = textos_texto
                    if link_texto:
                        item["link"] = link_texto
                        
                    perguntas.append(item)
                    pergunta_id_counter += 1

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(perguntas, f, ensure_ascii=False, indent=2)
        print(f"Sucesso! {len(perguntas)} perguntas extraídas para '{output_file}'.")
    except Exception as e:
        print(f"Erro ao salvar JSON: {e}")

if __name__ == "__main__":
    parse_livro()
