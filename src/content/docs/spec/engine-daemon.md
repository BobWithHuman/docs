---
title: Engine Daemon
description: 훅과 agentgateway가 보내는 요청을 받아 엔진 안으로 넘기는 입구.
---

## 하는 일

Engine Daemon은 엔진의 입구다. Claude Code 훅이 보내는 이벤트와 agentgateway의 ext_authz 요청을 받아 엔진 안으로 넘기고, 엔진이 낸 응답을 돌려준다. 훅 이벤트는 Collector로 넘어가 순번이 매겨지고, ext_authz 요청에는 PreToolUse에서 이미 나온 판정을 `tool_use_id`로 찾아 답한다. (확정)

엔진은 Redis, agentgateway와 함께 Docker로 로컬에서 띄운다. 엔진 코드는 OS를 구분하지 않으며 1차 지원 대상은 macOS와 Linux다. 엔진은 시작할 때 훅 인증에 쓸 토큰을 만들어 사용자만 읽을 수 있는 파일에 저장한다. (초안)

## 받는 것

훅은 127.0.0.1의 HTTP로 이벤트를 보낸다. 엔드포인트는 `POST /v1/hooks` 하나이고, 요청 본문은 훅이 stdin으로 받은 JSON을 그대로 쓴다. 어떤 이벤트인지는 본문의 `hook_event_name`으로 가른다. 요청에는 `Authorization: Bearer` 헤더로 토큰을 붙인다. (초안)

훅 명령은 `curl -sf --max-time 4 ... || true` 꼴로 둔다. 엔진이 죽었거나 답이 늦어도 훅은 오류 없이 끝나고, Claude Code는 원래 권한 확인으로 넘어간다. (초안)

1차에 받는 훅은 UserPromptSubmit, MessageDisplay, PreToolUse, PostToolUse 넷이다. (확정)

agentgateway는 MCP 도구 호출의 판정을 ext_authz gRPC로 묻는다. (확정)

## 내놓는 것

Engine Daemon은 노드나 간선을 만들지 않고, Provenance Record의 필드도 채우지 않는다. (확정)

훅에는 HTTP로 답한다. 통과면 `204`에 본문 없이, 차단이면 `200`에 훅 출력 형식의 JSON을 담아 보낸다. 엔진이 살아 있는지는 `GET /v1/healthz`로 확인한다. (초안)

ext_authz 요청에는 허용이나 거부로 답하고, 판정이 없으면 거부한다(fail closed). (확정) 판정마다 어떤 응답이 나가는지는 [PEP](/docs/spec/pep/)에 정리했다.

## Jev 질문

Engine Daemon은 Jev에 묻지 않는다. (확정)

## 미정

HTTP와 gRPC의 포트, 토큰 파일의 위치와 형식을 정하지 않았다. 엔진이 Docker 안에서 만든 토큰 파일을 호스트의 훅 명령이 어떻게 읽을지도 함께 정해야 한다. `GET /v1/healthz`가 무엇을 돌려주는지, 엔진 마감 3초를 넘겼을 때 무엇으로 답하는지도 아직 없다.

받는 이벤트 쪽에서는 TaskCreated, PostToolBatch, InstructionsLoaded를 받을지가 남아 있고, agentgateway 쪽에서는 ext_authz를 tools/call에만 걸 수 있는지 아직 확인하지 못했다. 판정용 그래프를 데몬 메모리에 둘지는 [Open Questions](/docs/spec/open-questions/)에 있다.
