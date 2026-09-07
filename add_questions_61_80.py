import json

novas_perguntas = [
  {
    "id_pergunta": "rev_064",
    "capitulo": 61,
    "titulo_capitulo": "Eles não adoraram a estátua",
    "dificuldade": "facil",
    "pergunta": "Quem o rei Nabucodonosor mandou jogar na fornalha ardente?",
    "resposta": "Sadraque, Mesaque e Abednego.",
    "curiosidade_extra": "O fogo estava tão quente que matou os soldados que os jogaram, mas um anjo protegeu os três de qualquer queimadura."
  },
  {
    "id_pergunta": "rev_065",
    "capitulo": 62,
    "titulo_capitulo": "Uma árvore muito alta",
    "dificuldade": "dificil",
    "pergunta": "Qual foi o castigo do rei Nabucodonosor por causa do seu orgulho?",
    "resposta": "Ficou louco, perdeu o reino por 7 anos e viveu com os animais.",
    "curiosidade_extra": "O cabelo dele cresceu parecendo penas de águia e suas unhas viraram garras, até ele reconhecer que Jeová é o Governante supremo."
  },
  {
    "id_pergunta": "rev_066",
    "capitulo": 63,
    "titulo_capitulo": "As palavras que apareceram na parede",
    "dificuldade": "medio",
    "pergunta": "O que as palavras misteriosas que apareceram na parede da festa de Belsazar queriam dizer?",
    "resposta": "Que a Babilônia seria invadida e o rei perderia o reino.",
    "curiosidade_extra": "Belsazar bebeu nos copos de ouro roubados do templo de Jeová; naquela mesma noite, o rei persa Ciro invadiu Babilônia."
  },
  {
    "id_pergunta": "rev_067",
    "capitulo": 64,
    "titulo_capitulo": "Daniel na cova dos leões",
    "dificuldade": "facil",
    "pergunta": "Por que Daniel foi jogado na cova dos leões?",
    "resposta": "Porque orava a Jeová, desobedecendo a lei do rei Dario.",
    "curiosidade_extra": "Jeová mandou um anjo fechar a boca dos leões. Depois, o rei jogou os inimigos de Daniel na cova."
  },
  {
    "id_pergunta": "rev_068",
    "capitulo": 65,
    "titulo_capitulo": "Ester salva o seu povo",
    "dificuldade": "medio",
    "pergunta": "Quem queria matar todos os judeus da Pérsia?",
    "resposta": "Um homem orgulhoso chamado Hamã.",
    "curiosidade_extra": "A rainha Ester era judia e foi muito corajosa ao aparecer para o rei sem ser chamada para salvar o seu povo."
  },
  {
    "id_pergunta": "rev_069",
    "capitulo": 66,
    "titulo_capitulo": "Esdras ensinou a lei de Deus",
    "dificuldade": "medio",
    "pergunta": "O que o sacerdote Esdras fez quando chegou a Jerusalém e reuniu o povo?",
    "resposta": "Leu e explicou as leis de Jeová.",
    "curiosidade_extra": "O povo chorou por ter desobedecido, mas Esdras os ajudou e eles celebraram a Festividade das Barracas."
  },
  {
    "id_pergunta": "rev_070",
    "capitulo": 67,
    "titulo_capitulo": "Os muros de Jerusalém",
    "dificuldade": "facil",
    "pergunta": "Quem o rei Artaxerxes enviou a Jerusalém para consertar os muros da cidade?",
    "resposta": "Neemias.",
    "curiosidade_extra": "Mesmo com as zombarias dos inimigos, os muros e portões de Jerusalém foram reconstruídos em apenas 52 dias."
  },
  {
    "id_pergunta": "rev_071",
    "capitulo": 68,
    "titulo_capitulo": "Elisabete fica grávida",
    "dificuldade": "dificil",
    "pergunta": "Por que o sacerdote Zacarias ficou mudo até o nascimento de seu filho, João?",
    "resposta": "Porque não acreditou na mensagem do anjo Gabriel.",
    "curiosidade_extra": "O trabalho do menino, João Batista, seria preparar as pessoas para a chegada do Messias."
  },
  {
    "id_pergunta": "rev_072",
    "capitulo": 69,
    "titulo_capitulo": "O anjo Gabriel visita Maria",
    "dificuldade": "facil",
    "pergunta": "Quem o anjo Gabriel disse que Maria daria à luz?",
    "resposta": "Jesus, que seria o Rei de um Reino eterno.",
    "curiosidade_extra": "Maria e Elisabete eram parentes e as duas ficaram grávidas de forma especial."
  },
  {
    "id_pergunta": "rev_073",
    "capitulo": 70,
    "titulo_capitulo": "O nascimento de Jesus",
    "dificuldade": "medio",
    "pergunta": "Em qual cidade Jesus nasceu?",
    "resposta": "Em Belém.",
    "curiosidade_extra": "Ele nasceu num estábulo porque não havia outro lugar, e os pastores foram os primeiros a ir vê-lo depois do aviso dos anjos."
  },
  {
    "id_pergunta": "rev_074",
    "capitulo": 71,
    "titulo_capitulo": "Jeová protegeu Jesus",
    "dificuldade": "medio",
    "pergunta": "Para qual lugar José e Maria fugiram para proteger Jesus do rei Herodes?",
    "resposta": "Para o Egito.",
    "curiosidade_extra": "Jeová não mandou os homens irem a Herodes; pelo contrário, um anjo avisou a José que Herodes queria matar Jesus."
  },
  {
    "id_pergunta": "rev_075",
    "capitulo": 72,
    "titulo_capitulo": "Jesus vai ao templo",
    "dificuldade": "facil",
    "pergunta": "Com que idade Jesus impressionou os instrutores no templo de Jerusalém?",
    "resposta": "Aos 12 anos de idade.",
    "curiosidade_extra": "José e Maria o procuraram por três dias até encontrá-lo ouvindo e fazendo perguntas sobre a Palavra de Deus."
  },
  {
    "id_pergunta": "rev_076",
    "capitulo": 73,
    "titulo_capitulo": "A mensagem de João Batista",
    "dificuldade": "facil",
    "pergunta": "Onde João Batista ensinava e batizava as pessoas?",
    "resposta": "Longe das cidades, no rio Jordão.",
    "curiosidade_extra": "João vestia roupa de pelo de camelo, comia gafanhotos e mel, e dizia que alguém muito maior do que ele estava chegando."
  },
  {
    "id_pergunta": "rev_077",
    "capitulo": 74,
    "titulo_capitulo": "Jesus se torna o Messias",
    "dificuldade": "medio",
    "pergunta": "O que desceu sobre Jesus na forma de uma pomba logo após o batismo dele?",
    "resposta": "O espírito santo de Deus.",
    "curiosidade_extra": "Naquele momento o céu se abriu e a voz de Jeová disse que O amava e O aprovava."
  },
  {
    "id_pergunta": "rev_078",
    "capitulo": 75,
    "titulo_capitulo": "O Diabo testa Jesus",
    "dificuldade": "dificil",
    "pergunta": "Qual foi a resposta de Jesus quando o Diabo tentou lhe dar todos os reinos do mundo em troca de adoração?",
    "resposta": "Vá embora, Satanás! Só devemos adorar a Jeová.",
    "curiosidade_extra": "Jesus ficou 40 dias sem comer no deserto e superou os três testes de Satanás repetindo leis da Palavra de Deus."
  },
  {
    "id_pergunta": "rev_079",
    "capitulo": 76,
    "titulo_capitulo": "Jesus expulsa os vendedores do templo",
    "dificuldade": "facil",
    "pergunta": "O que Jesus fez ao ver pessoas vendendo animais no templo?",
    "resposta": "Fez um chicote, expulsou os animais e derrubou as mesas.",
    "curiosidade_extra": "Jesus fez isso porque aquelas pessoas estavam transformando o templo de seu Pai em um lugar para ganhar dinheiro."
  },
  {
    "id_pergunta": "rev_080",
    "capitulo": 77,
    "titulo_capitulo": "Jesus e a mulher samaritana",
    "dificuldade": "medio",
    "pergunta": "Qual foi o pedido inusitado que Jesus fez à mulher samaritana no poço?",
    "resposta": "Pediu um pouco de água para beber.",
    "curiosidade_extra": "A mulher ficou surpresa porque judeus não falavam com samaritanos, mas Jesus falou e até lhe ofereceu a água da vida."
  },
  {
    "id_pergunta": "rev_081",
    "capitulo": 78,
    "titulo_capitulo": "Jesus prega sobre o Reino de Deus",
    "dificuldade": "facil",
    "pergunta": "Jesus prometeu aos pescadores que faria deles o quê?",
    "resposta": "Pescadores de homens.",
    "curiosidade_extra": "Pedro, André, Tiago e João deixaram suas redes na mesma hora para seguir Jesus e pregar as boas novas."
  },
  {
    "id_pergunta": "rev_082",
    "capitulo": 79,
    "titulo_capitulo": "Jesus faz muitos milagres",
    "dificuldade": "medio",
    "pergunta": "O que Jesus fez com a filha de Jairo, que tinha morrido?",
    "resposta": "Pegou a mão dela e a ressuscitou.",
    "curiosidade_extra": "Dos dez leprosos que Jesus curou a caminho do templo, apenas um voltou para lhe agradecer."
  },
  {
    "id_pergunta": "rev_083",
    "capitulo": 80,
    "titulo_capitulo": "Jesus escolhe seus 12 apóstolos",
    "dificuldade": "dificil",
    "pergunta": "O que Jesus fez a noite toda antes de escolher seus 12 apóstolos?",
    "resposta": "Ficou num monte, sozinho, orando a Jeová.",
    "curiosidade_extra": "Os apóstolos não eram homens perfeitos nem haviam estudado em escolas famosas, mas Jesus confiou neles."
  }
]

try:
    with open('assets/perguntas_revelar.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.extend(novas_perguntas)
    with open('assets/perguntas_revelar.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Capitulos 61-80 adicionados com sucesso!')
except Exception as e:
    print('Erro:', e)
