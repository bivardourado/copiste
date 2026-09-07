import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'modules/revelar/models/pergunta_revelar.dart';
import 'modules/revelar/repositories/perguntas_repository.dart';
import 'modules/revelar/bloc/revelar_cubit.dart';
import 'modules/revelar/ui/pages/revelar_page.dart';

void main() {
  runApp(const MeuJogoApp());
}

class MeuJogoApp extends StatelessWidget {
  const MeuJogoApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jogo Bíblico',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FutureBuilder<List<PerguntaRevelar>>(
        future: PerguntasRepository().carregarPerguntas(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text("Carregando o livro...")
                  ],
                ),
              ),
            );
          }

          if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
            return const Scaffold(
              body: Center(child: Text("Erro ao carregar as perguntas.")),
            );
          }

          final perguntas = snapshot.data!;
          final times = ["Equipe Fé", "Equipe Esperança"];

          return BlocProvider(
            create: (context) => RevelarCubit(perguntas, times),
            child: RevelarPage(),
          );
        },
      ),
    );
  }
}
