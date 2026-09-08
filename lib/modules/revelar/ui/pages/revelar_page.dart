import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../bloc/revelar_cubit.dart';
import '../../bloc/revelar_state.dart';

class RevelarPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Perguntas Bíblicas')),
      body: BlocBuilder<RevelarCubit, RevelarState>(
        builder: (context, state) {
          if (state is RevelarPerguntaOculta) {
            return _buildCardPergunta(context, state);
          } else if (state is RevelarRespostaMostrada) {
            return _buildCardResposta(context, state);
          } else if (state is RevelarFimDeJogo) {
            return _buildPlacar(context, state);
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }

  Widget _buildCardPergunta(BuildContext context, RevelarPerguntaOculta state) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Vez de: ${state.timeAtual}', textAlign: TextAlign.center, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),
          Flexible(
            child: SingleChildScrollView(
              child: Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: _getCorDificuldade(state.perguntaAtual.dificuldade),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              state.perguntaAtual.dificuldade.toUpperCase(),
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Text(
                        state.perguntaAtual.pergunta,
                        style: const TextStyle(fontSize: 24),
                        textAlign: TextAlign.center,
                      ),
                      if (state.perguntaAtual.textosBiblicos != null && state.perguntaAtual.textosBiblicos!.isNotEmpty) ...[
                        const SizedBox(height: 16),
                        Text(
                          state.perguntaAtual.textosBiblicos!,
                          style: const TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.grey),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: () => context.read<RevelarCubit>().revelarResposta(),
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(20)),
            child: const Text('Ver Resposta', style: TextStyle(fontSize: 18)),
          ),
        ],
      ),
    );
  }

  Widget _buildCardResposta(BuildContext context, RevelarRespostaMostrada state) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 400),
            child: Card(
              key: const ValueKey('resposta_card'),
              color: Colors.blue.shade50,
              elevation: 8,
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  children: [
                    Text(
                      state.perguntaAtual.pergunta,
                      style: const TextStyle(fontSize: 18, color: Colors.black87),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      state.perguntaAtual.resposta,
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                      textAlign: TextAlign.center,
                    ),
                    const Divider(height: 40),
                    Text(
                      "💡 Curiosidade:\n${state.perguntaAtual.curiosidadeExtra}",
                      style: const TextStyle(fontSize: 16, fontStyle: FontStyle.italic),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const Spacer(),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () => context.read<RevelarCubit>().registrarResposta(false),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade100, padding: const EdgeInsets.all(20)),
                  child: const Text('Errei', style: TextStyle(color: Colors.red)),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => context.read<RevelarCubit>().registrarResposta(true),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade100, padding: const EdgeInsets.all(20)),
                  child: const Text('Acertei', style: TextStyle(color: Colors.green)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPlacar(BuildContext context, RevelarFimDeJogo state) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('Fim de Jogo!', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),
          ...state.placar.entries.map((e) => Text('${e.key}: ${e.value} pontos', style: const TextStyle(fontSize: 24))),
          const SizedBox(height: 40),
          ElevatedButton(
            onPressed: () => context.read<RevelarCubit>().reiniciarJogo(),
            child: const Text('Jogar Novamente'),
          )
        ],
      ),
    );
  }

  Color _getCorDificuldade(String dificuldade) {
    switch (dificuldade.toLowerCase()) {
      case 'facil':
        return Colors.green;
      case 'medio':
        return Colors.orange;
      case 'dificil':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
