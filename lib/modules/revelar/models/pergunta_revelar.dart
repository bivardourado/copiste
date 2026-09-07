class PerguntaRevelar {
  final String idPergunta;
  final int capitulo;
  final String tituloCapitulo;
  final String dificuldade;
  final String pergunta;
  final String resposta;
  final String curiosidadeExtra;
  final String link;
  final String? textosBiblicos;

  PerguntaRevelar({
    required this.idPergunta,
    required this.capitulo,
    required this.tituloCapitulo,
    required this.dificuldade,
    required this.pergunta,
    required this.resposta,
    required this.curiosidadeExtra,
    required this.link,
    this.textosBiblicos,
  });

  factory PerguntaRevelar.fromJson(Map<String, dynamic> json) {
    return PerguntaRevelar(
      idPergunta: json['id_pergunta'] ?? '',
      capitulo: json['capitulo'] ?? 0,
      tituloCapitulo: json['titulo_capitulo'] ?? '',
      dificuldade: json['dificuldade'] ?? 'facil',
      pergunta: json['pergunta'] ?? '',
      resposta: json['resposta'] ?? '',
      curiosidadeExtra: json['curiosidade_extra'] ?? '',
      link: json['link'] ?? '',
      textosBiblicos: json['textosBiblicos'],
    );
  }
}
