import 'package:flutter_bloc/flutter_bloc.dart';
import 'revelar_state.dart';
import '../models/pergunta_revelar.dart';

class RevelarCubit extends Cubit<RevelarState> {
  final List<PerguntaRevelar> _perguntas;
  final List<String> _times;
  
  int _indiceAtual = 0;
  int _turnoAtual = 0;
  final Map<String, int> _placar = {};

  RevelarCubit(this._perguntas, this._times) : super(RevelarInitial()) {
    for (var time in _times) {
      _placar[time] = 0;
    }
    _iniciarRodada();
  }

  void _iniciarRodada() {
    if (_indiceAtual >= _perguntas.length) {
      emit(RevelarFimDeJogo(placar: _placar));
      return;
    }

    final pergunta = _perguntas[_indiceAtual];
    final timeAtual = _times[_turnoAtual % _times.length];

    emit(RevelarPerguntaOculta(
      perguntaAtual: pergunta,
      timeAtual: timeAtual,
    ));
  }

  void revelarResposta() {
    if (state is RevelarPerguntaOculta) {
      final estadoAtual = state as RevelarPerguntaOculta;
      emit(RevelarRespostaMostrada(
        perguntaAtual: estadoAtual.perguntaAtual,
        timeAtual: estadoAtual.timeAtual,
      ));
    }
  }

  void registrarResposta(bool acertou) {
    if (state is RevelarRespostaMostrada) {
      final estadoAtual = state as RevelarRespostaMostrada;
      
      if (acertou) {
        _placar[estadoAtual.timeAtual] = (_placar[estadoAtual.timeAtual] ?? 0) + 10;
      }

      _indiceAtual++;
      _turnoAtual++;
      
      _iniciarRodada();
    }
  }

  void reiniciarJogo() {
    _indiceAtual = 0;
    _turnoAtual = 0;
    _placar.updateAll((key, value) => 0);
    _iniciarRodada();
  }
}
