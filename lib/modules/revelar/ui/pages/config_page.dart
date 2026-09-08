import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/revelar_cubit.dart';
import '../../models/pergunta_revelar.dart';
import 'revelar_page.dart';

class ConfigPage extends StatefulWidget {
  final List<PerguntaRevelar> perguntas;

  const ConfigPage({Key? key, required this.perguntas}) : super(key: key);

  @override
  _ConfigPageState createState() => _ConfigPageState();
}

class _ConfigPageState extends State<ConfigPage> {
  bool _isGrupo = false;
  final TextEditingController _time1Controller = TextEditingController(text: "Equipe Fé");
  final TextEditingController _time2Controller = TextEditingController(text: "Equipe Esperança");

  void _iniciarJogo() {
    List<String> times = _isGrupo
        ? [_time1Controller.text.trim(), _time2Controller.text.trim()]
        : ["Jogador 1"];

    if (_isGrupo && (times[0].isEmpty || times[1].isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Preencha o nome das duas equipes!")),
      );
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => BlocProvider(
          create: (context) => RevelarCubit(widget.perguntas, times),
          child: RevelarPage(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Perguntas Bíblicas - Início')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              "Selecione o Modo de Jogo",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => setState(() => _isGrupo = false),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: !_isGrupo ? Colors.blue : Colors.grey.shade300,
                      foregroundColor: !_isGrupo ? Colors.white : Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                    ),
                    child: const Text('Modo Solo'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => setState(() => _isGrupo = true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isGrupo ? Colors.blue : Colors.grey.shade300,
                      foregroundColor: _isGrupo ? Colors.white : Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                    ),
                    child: const Text('Modo Grupo'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            if (_isGrupo) ...[
              TextField(
                controller: _time1Controller,
                decoration: const InputDecoration(
                  labelText: 'Nome da Equipe 1',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _time2Controller,
                decoration: const InputDecoration(
                  labelText: 'Nome da Equipe 2',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
            const Spacer(),
            ElevatedButton(
              onPressed: _iniciarJogo,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(20),
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
              child: const Text('COMEÇAR JOGO', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _time1Controller.dispose();
    _time2Controller.dispose();
    super.dispose();
  }
}
