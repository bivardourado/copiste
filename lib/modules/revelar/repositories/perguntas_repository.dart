import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/pergunta_revelar.dart';

class PerguntasRepository {
  Future<List<PerguntaRevelar>> carregarPerguntas() async {
    try {
      final ByteData data = await rootBundle.load('assets/perguntas_revelar.json');
      final String jsonString = utf8.decode(data.buffer.asUint8List());
      final List<dynamic> jsonList = json.decode(jsonString);
      final perguntas = jsonList.map((json) => PerguntaRevelar.fromJson(json)).toList();
      perguntas.shuffle();
      return perguntas;
    } catch (e) {
      print('Erro ao carregar o JSON: $e');
      return [];
    }
  }
}
