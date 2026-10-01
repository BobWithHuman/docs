---
title: Edges
description: 노드를 잇는 간선 아홉 종류와, 시작점을 찾을 때 따라가는 간선.
sidebar:
  order: 4
---

간선은 9종이고 제어 의존, 데이터 의존, 구조의 세 갈래로 나뉜다. 간선은 늘 먼저 관찰된 노드를 향하므로 그래프에 순환이 없다. (확정)

| 간선 | 갈래 | 뜻 | 시작점 찾을 때 | 상태 |
|---|---|---|---|---|
| performs | 제어 의존 | 호출이 그 할 일을 수행한다 (Call → Task) | 계속 올라감 | 확정 |
| substep_of | 제어 의존 | 할 일이 앞선 할 일을 쪼갠 한 단계다 (Task → Task) | 계속 올라감 | 확정 |
| advances | 제어 의존 | 할 일이 요청이나 맡긴 문서의 주제를 진행시킨다 | 멈춤 | 확정 |
| instructed_by | 제어 의존 | 문단이 이 할 일을 시켰다 | 멈춤 | 확정 |
| responds_to | 제어 의존 | 할 일이 직전 오류에 대응한다 | 멈춤 | 확정 |
| value_from | 데이터 의존 | 값이 그곳에 글자 그대로 적혀 있다 | 안 씀 | 확정 |
| derived_from | 데이터 의존 | 값이 그곳에서 가리키거나 계산된 대상이다 | 안 씀 | 확정 |
| part_of | 구조 | 인자가 호출에 속한다 | 안 씀 | 확정 |
| produced_by | 구조 | 문단이 그 호출의 결과로 들어왔다 | 안 씀 | 확정 |

## 간선 규칙

간선은 세 가지 규칙을 지켜 만든다. 첫째, 허용된 (짝, 종류) 조합 17개 안에서만 만든다. 둘째, 의존받는 쪽이 먼저 관찰된 노드여야 한다. 셋째, Jev로 잇는 간선은 기준 점수를 넘을 때만 쓴다. (확정)

기준 점수는 지금 0.5를 임시로 쓰고, 실제 데이터로 다시 정한다. (초안)

허용 조합 17개의 목록은 아직 없다. 짝이 명시된 것은 performs(Call → Task)와 substep_of(Task → Task)뿐이다. 나머지는 뜻으로 미루어 advances는 할 일에서 요청이나 주제 문단으로, instructed_by는 할 일에서 문단으로, value_from은 요소에서 요청이나 문단으로 향하는 것처럼 읽히지만, "할 일 없음"일 때 호출을 후보와 직접 짝짓는 경우까지 포함해 목록으로 정해야 한다. (미정)

## 시작점은 제어 의존만 따라간다

시작점을 찾을 때는 제어 의존 간선만 따라간다. 구조 간선까지 따라가면, 숨긴 문단이 "이슈를 읽은 호출의 결과"(produced_by)를 거쳐 사용자 요청까지 올라가 버려 공격이 통과한다. 데이터 의존 간선까지 따라가면, 주소만 문서에서 가져온 정상 호출의 시작점이 문서가 되어 막힌다. (확정)

performs와 substep_of를 만나면 계속 올라가고 advances, instructed_by, responds_to를 만나면 멈춘다. 한 할 일에서 여러 간선이 기준을 넘었을 때 어느 것을 따라가는지는 [Provenance Tracer](/docs/spec/causal-layer/provenance-tracer/)에 정리했다. (확정)

## 간선을 만드는 곳

part_of는 Call Parser가, value_from은 Token Index가 만든다. performs, substep_of, advances, instructed_by, responds_to는 Provenance Tracer가 만든다. (확정)

produced_by와 derived_from을 어느 모듈이 언제 만드는지는 정하지 않았다. (미정)
