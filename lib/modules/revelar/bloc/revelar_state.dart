import '../models/pergunta_revelar.dart';

abstract class RevelarState {}

class RevelarInitial extends RevelarState {}

class RevelarPerguntaOculta extends RevelarState {
  final PerguntaRevelar perguntaAtual;
  final String timeAtual;

  RevelarPerguntaOculta({required this.perguntaAtual, required this.timeAtual});
}

class RevelarRespostaMostrada extends RevelarState {
  final PerguntaRevelar perguntaAtual;
  final String timeAtual;

  RevelarRespostaMostrada({required this.perguntaAtual, required this.timeAtual});
}

class RevelarFimDeJogo extends RevelarState {
  final Map<String, int> placar;

  RevelarFimDeJogo({required this.placar});
}
