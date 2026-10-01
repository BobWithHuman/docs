---
title: Collector
description: 엔진이 받은 이벤트에 순번을 매기고 그래프의 노드로 저장합니다.
sidebar:
  order: 1
---

## 하는 일

Collector는 엔진이 받은 이벤트마다 순번을 매기고 노드로 저장합니다. 그래프에서 무엇이 먼저인지는 이 순번으로 정합니다. 자세한 규칙은 [Identifiers and Ordering](/docs/spec/common-model/identifiers-and-ordering/)에 있습니다.

| 이벤트 | 만드는 노드 |
|---|---|
| UserPromptSubmit | Request |
| MessageDisplay | Task |
| PostToolUse | Segment. tool_response를 문단으로 나눠 만듭니다. |
| PreToolUse | 없음. 순번만 매기고, Call과 Element는 Call Parser가 만듭니다. |

1차 개발의 첫 단계는 Collector까지만 만들고 판정은 모두 통과시킵니다. 평가 환경에서 작업을 돌려 기록을 쌓으면, 에이전트가 할 일을 말하는 비율, 이벤트가 오는 순서, 훅별 필드 모양을 실제 데이터로 확인할 수 있습니다.

## 받는 것

| 입력 | 보내는 곳 |
|---|---|
| 훅 이벤트: UserPromptSubmit, MessageDisplay, PreToolUse, PostToolUse | Engine Daemon |

## 내놓는 것

| 출력 | 내용 |
|---|---|
| 노드 | Request, Task, Segment |
| 간선 | 만들지 않습니다. |
| Provenance Record | 채우지 않습니다. |
| 기록 | 만든 노드를 Provenance Log에 기록합니다. |

## Jev 질문

Collector는 Jev에 묻지 않습니다.

## 미정

- 순번의 형식.
- tool_response를 문단으로 나누는 규칙.
- produced_by 간선과, 요청에서 가리킨 문서의 기록을 어느 모듈이 맡을지. 둘 다 이벤트가 들어올 때 해야 하는 일입니다.
- 요청에서 사용자가 가리킨 문서를 알아보는 방법.
- 훅별 필드 모양. Grep 결과처럼 tool_response가 글 한 덩어리로 오는지 객체로 오는지도 수집 기록으로 확인합니다.
- TaskCreated를 수집할지.
- 대화 모드에서도 MessageDisplay가 호출보다 먼저 오는지. 지금까지는 비대화 모드 25건만 확인했습니다.
