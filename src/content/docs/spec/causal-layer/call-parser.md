---
title: Call Parser
description: 도구 호출을 Call과 Element로 나누고, 가져온 값과 새로 쓴 값을 구분합니다.
sidebar:
  order: 1
---

## 하는 일

Call Parser는 PreToolUse로 들어온 호출을 가장 먼저 처리합니다. 호출을 Call 노드 하나로 만들고, 인자의 (역할, 값) 쌍마다 Element 노드를 하나씩 만듭니다.

그다음 요소마다 가져온 값인지 새로 쓴 값인지 구분합니다. 메일 본문이나 코드처럼 에이전트가 새로 쓴 값은 이후 단계에서 검사하지 않습니다.

1차에는 MCP 도구의 인자부터 나눕니다. Bash 명령의 heredoc과 함수 정의는 평가 전 범위에서 빠져 있습니다.

## 받는 것

| 입력 | 보내는 곳 |
|---|---|
| PreToolUse 이벤트의 tool_name, tool_input, `tool_use_id` | Collector |

## 내놓는 것

| 출력 | 내용 |
|---|---|
| 노드 | Call, Element |
| 간선 | part_of (Element → Call) |
| Provenance Record | 호출·요소 필드에 들어갈 호출과 요소 |
| 값 구분 | 요소마다 가져온 값인지 새로 쓴 값인지 |

## Jev 질문

정해진 질문은 없습니다. 가져온 값과 새로 쓴 값을 구분할 때 Jev를 쓸지는 그 기준과 함께 정합니다.

## 미정

- 가져온 값과 새로 쓴 값을 구분하는 기준.
- Element의 역할 이름 목록.
- 내장 도구의 인자를 나누는 방법.
- Bash 명령의 heredoc과 함수 정의를 다루는 방법.
