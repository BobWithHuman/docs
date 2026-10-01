---
title: Nodes
description: 인과 그래프를 이루는 노드 다섯 종류입니다.
sidebar:
  order: 3
---

인과 구조 파악 계층은 노드 5종과 간선 9종으로 된 방향 그래프를 만듭니다. 이 페이지에서는 노드 다섯 종류가 무엇을 담고 언제 생기는지 설명합니다.

| 노드 | 내용 | 생기는 때 | 만드는 모듈 |
|---|---|---|---|
| Request | 사용자가 보낸 요청 | UserPromptSubmit | Collector |
| Task | 에이전트가 호출 전에 말한 할 일 | MessageDisplay | Collector |
| Call | 도구 호출 | PreToolUse | Call Parser |
| Segment | 에이전트가 읽은 글의 한 문단 | PostToolUse | Collector |
| Element | 호출 인자의 (역할, 값) 한 쌍 | PreToolUse | Call Parser |

## Request

요청과 함께, 사용자가 요청에서 가리킨 문서(#12 같은 이슈, 붙여 넣은 글, 링크)를 기록합니다. 나중에 그 문서를 읽으면 이 기록을 보고 주제를 표시합니다.

## Task

Task는 들어오는 즉시 부모를 판단합니다. 그래서 호출이 오기 전에 이미 요청이나 앞선 할 일, 시키는 문단과 연결돼 있을 수 있습니다. 호출 직전까지 할 일이 들어오지 않으면 Task 없이 "할 일 없음"으로 처리합니다.

## Call

Call마다 바깥 영향이 있는지 판별합니다. 판별 결과는 도구 이름 단위로 저장해 다시 씁니다. Bash는 명령 앞부분 단위로 저장합니다.

## Segment

tool_response를 문단으로 나눈 것입니다. 어느 호출의 결과인지는 produced_by 간선으로 연결합니다. Segment Analyzer가 문단마다 시키는 문장인지, 주제인지, 숨긴 글인지 표시합니다.

## Element

Call Parser가 요소마다 가져온 값인지 새로 쓴 값인지 구분합니다. 가져온 값은 출처를 찾은 뒤 하나씩 확인합니다. 확인 규칙은 [Value Types](/docs/spec/common-model/value-types/)에 있습니다.

## 미정

- 노드별 필드 이름과 형식. 훅별 필드 모양을 수집 기록으로 본 뒤 정합니다.
- TaskCreated로 들어온 할 일도 Task로 만들지. 수집 여부와 함께 정합니다.
- tool_response를 문단으로 나누는 규칙과 Element의 역할 이름 목록.
- 직전 오류를 어떤 노드로 나타낼지. responds_to가 향하는 곳이자 시작점 ERROR에 해당합니다.
- 사용자 설정 파일(USER)과 저장소 지침 파일(DELEGATED)이 어떤 노드로 들어올지. InstructionsLoaded의 필드 구조도 아직 확인하지 못했습니다.
- 붙여 넣은 글을 Request 안에 둘지, 별도 문단으로 만들지.
