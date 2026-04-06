
Objetivo: corrigir o viewer 3D de forma robusta, deixando a exibição limpa, realista e previsível, sem os artefatos visuais que estão “cortando” o carro.

1. Reestruturar o posicionamento do carro
- Parar de centralizar o modelo pelo centro total do bounding box em Y.
- Em vez disso, calcular:
  - centro em X/Z para alinhar horizontalmente
  - base mínima em Y para “assentar” o carro no chão
- Isso evita que metade do carro afunde no piso e elimina o efeito de objeto atravessando o modelo.

2. Remover a fonte principal dos bugs visuais
- Substituir o piso circular atual por um “studio floor” mais neutro e controlado.
- Ajustar ou remover temporariamente `ContactShadows` se ele estiver gerando manchas/artefatos no centro.
- Garantir que o piso fique sempre abaixo da base real do carro, com pequeno offset técnico.

3. Corrigir a renderização inicial
- Trocar o fallback da caixa por um estado visual discreto fora do canvas ou por um fallback quase invisível.
- Manter `useGLTF.preload`, mas evitar que o placeholder apareça como se fosse o modelo principal.
- Fazer o modelo só entrar em cena quando o GLB estiver pronto.

4. Melhorar realismo sem “bugar”
- Manter ambiente claro de estúdio/garagem, mas com configuração mais estável:
  - fundo claro
  - iluminação key/fill/rim mais suave
  - sombras menos agressivas
  - sem elementos decorativos intrusivos no meio da cena
- Ajustar câmera e controles para destacar o carro sem clipping no chão.

5. Tornar a escala consistente entre modelos
- Continuar normalizando escala por bounding box, mas com limites mais seguros.
- Aplicar uma altura/piso consistente para modelos diferentes do select.
- Isso garante que cada carro trocado no select apareça corretamente, sem pular, afundar ou flutuar.

6. Blindar contra modelos problemáticos
- Adicionar tratamento básico para modelos com pivô ruim, dimensões estranhas ou materiais incompletos.
- Se necessário, isolar materiais e corrigir propriedades como `side`, `envMapIntensity` e sombras por mesh.
- Resultado esperado: o viewer continua funcional mesmo com GLBs diferentes dentro de `public/models`.

Arquivos a ajustar
- `src/components/platform/CarWireframe3D.tsx`
- possivelmente pequenos ajustes em `src/pages/DigitalChassis.tsx` apenas se precisarmos melhorar a troca de modelo no select

O que deve mudar visualmente
- carro assentado corretamente no chão
- sem “negócio no meio”
- sem caixa aparecendo na carga inicial
- fundo claro e premium
- troca entre modelos funcionando de forma estável

Detalhes técnicos
```text
Hoje o problema mais provável é este:
- o modelo é centralizado usando o centro completo do bounding box
- depois o grupo inteiro é deslocado manualmente
- o piso fica em y = -1
- o resultado é interseção entre carro, sombra e chão

A correção ideal:
1. calcular bounding box do modelo clonado
2. escalar
3. centralizar apenas X/Z
4. alinhar Y pela base do modelo
5. posicionar o piso um pouco abaixo dessa base
6. reduzir efeitos que geram artefatos visuais
```

Implementação sugerida
- refatorar `CarModel` para retornar transformação baseada em `min.y` e não no centro completo
- simplificar a cena primeiro para estabilidade
- depois reintroduzir realismo com iluminação e sombras mais seguras
- manter o select com os arquivos `.glb` em `public/models/`

Resultado esperado após implementação
- visual mais próximo da referência enviada
- sem cortes no carro
- sem glitches na inicialização
- base pronta para adicionar mais modelos depois sem quebrar o viewer
