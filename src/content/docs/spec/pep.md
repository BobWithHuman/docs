---
title: PEP
description: 판정을 PreToolUse 훅과 agentgateway ext_authz에서 실제로 집행한다.
---

## 하는 일

PEP는 Decision Module의 판정을 도구가 실행되기 전에 집행한다. 막는 곳은 둘이다. 내장 도구는 PreToolUse 훅의 응답으로, MCP 도구는 agentgateway의 ext_authz 응답으로 막는다. (확정)

내장 도구가 통과일 때는 PreToolUse에 아무 응답도 하지 않는다. allow를 보내면 Claude Code의 원래 권한 확인을 건너뛰기 때문이다. MCP는 판정이 없으면 차단한다(fail closed). (확정)

## 받는 것

Decision Module이 넘긴 판정과 차단 사유를 받는다. MCP 도구는 agentgateway가 ext_authz gRPC로 판정을 묻고, PEP는 PreToolUse에서 나온 판정을 `tool_use_id`로 찾는다. (확정)

## 내놓는 것

판정은 막는 곳에 따라 아래 응답이 된다.

| 판정 | 내장 도구 (PreToolUse 훅) | MCP 도구 (agentgateway ext_authz) |
|---|---|---|
| 통과 | 아무 응답도 하지 않는다 (확정). 엔진은 HTTP `204`, 본문 없이 답한다 (초안) | 허용 (확정) |
| 차단 | HTTP `200`에 훅 출력 형식의 JSON을 담아 답한다 (초안) | 거부 (확정) |
| 묻기 | 1차 평가에서는 차단과 같이 처리한다 (확정) | 1차 평가에서는 차단과 같이 처리한다 (확정) |
| 판정 없음 | 훅 명령이 `\|\| true`로 끝나 원래 권한 확인으로 넘어간다 (초안) | 거부, fail closed (확정) |

차단 사유는 Decision Module이 쓴 그대로 전한다. 사유에는 무엇에 걸렸는지가 아니라 무엇을 하면 되는지만 들어 있다. (확정)

PEP는 노드나 간선을 만들지 않고 Provenance Record의 필드도 채우지 않는다. (확정)

## Jev 질문

PEP는 Jev에 묻지 않는다. (확정)

## 미정

ext_authz를 MCP의 tools/call에만 걸 수 있는지, agentgateway에서 `tool_use_id`를 담는 `claudecode/toolUseId`가 공식으로 약속된 필드인지 아직 확인하지 못했다. MCP 도구 호출에도 PreToolUse 훅이 오는데, 이때 훅 쪽에서 무엇을 답할지 정하지 않았다. 차단 JSON의 어느 필드에 사유를 담는지, 묻기를 1차 다음에 어떻게 사용자에게 전할지도 남아 있다.
