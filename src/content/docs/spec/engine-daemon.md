---
title: Engine Daemon
description: 훅과 agentgateway의 요청을 받아 엔진 안으로 넘기는 엔진의 입구입니다.
---

## 하는 일

Engine Daemon은 엔진의 입구입니다. Claude Code 훅이 보낸 이벤트는 Collector로 넘기고, agentgateway의 ext_authz 요청은 PEP로 넘깁니다. 엔진 안에서 나온 응답은 다시 훅과 agentgateway에 돌려줍니다.

### 훅 연결

이 절의 연결 방식은 이번 명세에서 정한 초안입니다.

훅은 127.0.0.1의 HTTP로 이벤트를 보냅니다.

| 항목 | 내용 |
|---|---|
| 엔드포인트 | `POST /v1/hooks` 하나를 모든 훅이 함께 씁니다. |
| 요청 본문 | 훅이 stdin으로 받은 JSON을 그대로 보냅니다. 이벤트 종류는 `hook_event_name`으로 구분합니다. |
| 인증 | `Authorization: Bearer` 토큰을 씁니다. 엔진이 시작할 때 토큰을 만들어, 사용자만 읽을 수 있는 파일에 저장합니다. |
| 통과 응답 | `204`, 본문 없음 |
| 차단 응답 | `200`, 훅 출력 형식의 JSON |
| 상태 확인 | `GET /v1/healthz` |

훅 명령은 `curl -sf --max-time 4 ... || true` 형태로 둡니다. 엔진이 꺼져 있거나 응답이 늦어도 훅은 정상 종료되고, Claude Code는 원래 권한 확인으로 넘어갑니다.

### 실행 환경

엔진은 Redis, agentgateway와 함께 Docker로 로컬에서 실행합니다. 엔진 코드는 OS에 의존하지 않으며, 1차 지원 대상은 macOS와 Linux입니다. 이 실행 환경도 이번 명세에서 정한 초안입니다.

## 받는 것

| 입력 | 보내는 곳 |
|---|---|
| 훅 이벤트: UserPromptSubmit, MessageDisplay, PreToolUse, PostToolUse | Claude Code 훅 |
| ext_authz 요청 (gRPC) | agentgateway |

1차에 받는 훅 이벤트는 위 네 가지입니다.

## 내놓는 것

| 출력 | 내용 |
|---|---|
| 노드 | 만들지 않습니다. |
| 간선 | 만들지 않습니다. |
| Provenance Record | 채우지 않습니다. |
| 훅 이벤트 | Collector로 넘깁니다. |
| 응답 | 훅과 agentgateway에 응답을 돌려줍니다. 판정별 응답은 [PEP](/docs/spec/pep/)에 있습니다. |

## Jev 질문

Engine Daemon은 Jev에 묻지 않습니다.

## 미정

- HTTP와 gRPC 포트.
- 토큰 파일의 위치와 형식. Docker 안에서 엔진이 만든 토큰을 호스트의 훅 명령이 어떻게 읽을지도 함께 정해야 합니다.
- `GET /v1/healthz`의 응답 내용.
- 엔진 마감 3초를 넘겼을 때의 응답.
- TaskCreated, PostToolBatch, InstructionsLoaded를 받을지.
- ext_authz를 tools/call에만 걸 수 있는지. 아직 확인하지 못했습니다.
- 판정용 그래프를 데몬 메모리에 둘지. [Open Questions](/docs/spec/open-questions/#판정용-그래프를-어디에-둘지)에서 다룹니다.
