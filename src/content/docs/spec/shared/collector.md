---
title: Collector
description: 엔진이 받은 이벤트에 순번을 매기고 그래프의 노드로 저장한다.
sidebar:
  order: 1
---

## 하는 일

Collector는 Engine Daemon이 넘긴 훅 이벤트마다 순번을 매기고 노드로 저장한다. 그래프에서 무엇이 먼저인지는 이 순번으로 정한다([Identifiers and Ordering](/docs/spec/common-model/identifiers-and-ordering/)). (확정)

이벤트마다 만드는 노드가 다르다. UserPromptSubmit이 오면 요청을 Request 노드로, MessageDisplay가 오면 에이전트가 말한 할 일을 Task 노드로 저장한다. PostToolUse가 오면 tool_response를 문단으로 나눠 Segment 노드로 저장한다. PreToolUse에도 순번을 매기지만 Call과 Element 노드는 Call Parser가 만든다. (확정)

1차 개발의 첫 단계는 Collector까지만 만들고 판정은 전부 통과시킨다. 평가 환경의 작업을 돌려 기록을 쌓으면, 에이전트가 할 일을 말하는 비율, 이벤트가 오는 순서, 훅별 필드 모양을 실제 데이터로 확인할 수 있다. (확정)

## 받는 것

Engine Daemon이 넘긴 훅 이벤트를 받는다. 1차에는 UserPromptSubmit, MessageDisplay, PreToolUse, PostToolUse 넷이다. (확정)

## 내놓는 것

Request, Task, Segment 노드를 만들고, 모든 이벤트에 순번을 매긴다. 만든 노드는 Provenance Log에 기록한다. Provenance Record의 필드는 채우지 않는다. (확정)

PostToolUse의 문단을 `tool_use_id`로 원래 호출에 잇는 produced_by 간선, 그리고 요청 때 사용자가 가리킨 문서(이슈, 붙여 넣은 글, 링크)의 기록은 이벤트가 들어올 때 해야 하는 일이지만, 어느 모듈이 맡는지는 정하지 않았다. (미정)

## Jev 질문

Collector는 Jev에 묻지 않는다. (확정)

## 미정

순번의 모양, tool_response를 문단으로 나누는 규칙, 요청에서 사용자가 가리킨 문서를 알아보는 방법을 정하지 않았다. 훅별 필드 모양은 수집 기록을 본 뒤 확정하고, Grep 결과처럼 tool_response가 글 한 덩어리로 오는지 객체로 오는지도 그때 확인한다. TaskCreated를 수집할지, 대화 모드에서도 MessageDisplay가 호출보다 먼저 오는지(지금까지는 비대화 모드 25건만 확인)도 남아 있다.
