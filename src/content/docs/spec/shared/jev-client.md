---
title: Jev Client
description: 엔진에서 Jev로 가는 질문을 묶어 보내고 답을 캐시한다.
sidebar:
  order: 2
---

## 하는 일

엔진이 Jev에 묻는 질문은 모두 Jev Client를 거친다. Jev Client는 질문을 묶어 보내고 답을 캐시한다. (확정)

Jev는 글을 쓰지 못하므로 질문은 모두 "이 문장이 맞는가" 꼴로 묻는다. 할 일과 후보 하나를 끼운 진술문 하나를 보내면 Jev는 그 진술이 맞을 확률로 답한다. 앞뒤 대화는 넣지 않고, 반사실 재실행도 하지 않는다. 후보마다 물을 간선이 하나씩 정해져 있고 없는 대상은 묻지 않으므로, 질문 수는 후보 수와 같다. (확정)

Jev 한 번에는 1.5초까지 쓴다. 응답을 받지 못하면 그 판단은 UNRESOLVED가 된다. (확정)

## 받는 것

Provenance Tracer와 Segment Analyzer가 만든 진술문을 받는다. (확정)

## 내놓는 것

진술문마다 그 진술이 맞을 확률을 돌려주고, 응답을 받지 못했으면 받지 못했다는 결과를 돌려준다. 노드나 간선을 만들지 않고 Provenance Record의 필드도 채우지 않는다. (확정)

## Jev 질문

Jev Client는 스스로 질문을 만들지 않는다. 실제 질문은 그 질문을 쓰는 모듈의 페이지에 있다. 부모 판단, 수행 확인, 바깥 영향, 값 확인 질문은 [Provenance Tracer](/docs/spec/causal-layer/provenance-tracer/#jev-질문)에, 시키는 문장 표시 질문은 [Segment Analyzer](/docs/spec/segment-analyzer/#jev-질문)에 있다. (확정)

질문 문구는 모두 초안이고, 간선을 잇는 기준 점수 0.5도 임시 값이다. 둘 다 Jev 질문 확인 단계에서 실제 데이터로 다시 정한다. (초안)

## 미정

Jev가 어디서 돌고 Jev Client와 어떻게 연결되는지, 질문을 몇 개씩 묶는지, 캐시를 어떤 질문끼리 같다고 보고 언제까지 유지하는지를 정하지 않았다.

설계 전체가 걸린 가정도 아직 확인하지 못했다. Jev가 advances, instructed_by, performs를 정상과 공격으로 실제로 가르는지 봐야 한다. 지금까지 실제로 Jev에 물어 잰 점수는 몇 건뿐이다. 정상과 공격의 점수가 얼마나 벌어져야 쓸 만한지는 수집기를 만드는 동안 미리 정해 둔다.
