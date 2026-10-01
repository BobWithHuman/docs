---
title: Call Parser
description: 도구 호출을 Call과 Element로 나누고, 가져온 값과 새로 쓴 값을 가른다.
sidebar:
  order: 1
---

## 하는 일

PreToolUse로 호출이 들어오면 인과 구조 파악 계층에서 가장 먼저 일한다. 호출을 Call 노드 하나와, 인자의 (역할, 값) 쌍마다 Element 노드 하나로 나눈다. 그리고 요소마다 어딘가에서 가져온 값인지, 메일 본문이나 코드처럼 에이전트가 새로 쓴 값인지를 가른다. 새로 쓴 값은 뒤 단계에서 따지지 않는다. (확정)

1차에는 MCP 도구의 인자부터 나눈다. Bash 명령의 heredoc과 함수 정의는 평가 전 범위에서 빠져 있다. (확정)

## 받는 것

PreToolUse 이벤트의 tool_name, tool_input, `tool_use_id`를 받는다. (확정)

## 내놓는 것

Call 노드와 Element 노드를 만들고, 요소마다 호출에 잇는 part_of 간선을 만든다. Provenance Record의 호출·요소 필드에 들어갈 내용이 여기서 나온다. (확정)

## Jev 질문

정해진 질문은 없다. (확정) 가져온 값과 새로 쓴 값을 가를 때 Jev를 쓸지는 그 기준과 함께 정한다. (미정)

## 미정

가져온 값과 새로 쓴 값을 가르는 기준, Element의 역할 이름 목록을 정하지 않았다. 내장 도구의 인자를 어떻게 나눌지, Bash 명령에서 heredoc과 함수 정의를 어떻게 다룰지도 남아 있다.
