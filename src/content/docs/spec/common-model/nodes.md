---
title: Nodes
description: 인과 그래프를 이루는 노드 다섯 종류.
sidebar:
  order: 3
---

인과 구조 파악 계층은 노드 5종과 간선 9종으로 된 방향 그래프를 만든다. 노드는 아래 다섯 가지다. (확정)

| 노드 | 내용 | 들어오는 이벤트 | 만드는 곳 | 상태 |
|---|---|---|---|---|
| Request | 사용자가 보낸 요청 | UserPromptSubmit | Collector | 확정 |
| Task | 에이전트가 호출 전에 말한 할 일 | MessageDisplay | Collector | 확정 |
| Call | 도구 호출 | PreToolUse | Call Parser | 확정 |
| Segment | 에이전트가 읽은 글의 한 문단 | PostToolUse | Collector | 확정 |
| Element | 호출 인자의 (역할, 값) 한 쌍 | PreToolUse | Call Parser | 확정 |

## 노드마다 붙는 것

Request에는 요청 때 사용자가 가리킨 문서(#12 같은 이슈, 붙여 넣은 글, 링크)를 함께 기록해 둔다. 나중에 그 문서를 읽으면 이 기록을 보고 주제를 표시한다. (확정)

Task는 들어오는 즉시 부모를 미리 판단해 두기 때문에, 호출이 오기 전에 이미 요청이나 앞선 할 일, 시키는 문단과 이어져 있을 수 있다. 호출 직전에 할 일이 끝내 들어오지 않으면 Task 없이 "할 일 없음"으로 둔다. (확정)

Call마다 바깥 영향이 있는지를 판별한다. 답은 도구 이름 단위(Bash는 명령 앞부분 단위)로 저장해 다시 쓴다. (확정)

Segment는 tool_response를 문단으로 나눈 것이고, 어느 호출의 결과로 들어왔는지가 produced_by로 이어진다. Segment Analyzer가 문단마다 시키는 문장인지, 주제인지, 숨긴 글인지를 표시한다. (확정)

Element는 Call Parser가 가져온 값인지 새로 쓴 값인지를 가른다. 가져온 값은 어디서 왔는지 찾은 뒤 하나씩 확인한다([Value Types](/docs/spec/common-model/value-types/)). (확정)

## 미정

노드마다 어떤 필드를 어떤 이름으로 갖는지는 훅별 필드 모양을 수집 기록으로 본 뒤 정한다. TaskCreated로 들어온 할 일도 Task로 만들지는 수집 여부와 함께 정해야 한다. 도구 결과를 문단으로 나누는 규칙, Element의 역할 이름 목록도 아직 없다.

그래프에 어떻게 들어오는지 정하지 않은 것도 있다. 직전 오류(responds_to가 향하는 곳, 시작점 ERROR)를 어떤 노드로 나타낼지, 사용자 자신의 설정 파일(USER)과 저장소 지침 파일(DELEGATED)이 어떤 노드로 들어오는지, 붙여 넣은 글이 Request 안에 머무는지 따로 문단이 되는지가 그렇다. InstructionsLoaded의 필드 구조는 아직 확인하지 못했다.
