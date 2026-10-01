---
title: Overview
description: 도구 호출이 어디서 시작됐는지를 보고 실행 전에 막는 판정 엔진의 명세 v0이다.
---

## 무엇을 만드는가

AI 에이전트(Claude Code)가 잘못된 도구 호출을 하려 할 때, 그 호출이 어디서 시작됐는지를 근거로 실행 전에 막는 판정 엔진(PDP)을 만든다. 간접 프롬프트 인젝션이 대표 시나리오지만, 오류 뒤의 권한 상승이나 맡은 범위를 벗어난 행동도 같은 구조로 다룬다. 에이전트 자체는 고치지 않고 훅만 쓴다. (확정)

## 핵심 아이디어

출처가 아니라 원인을 본다. 외부 문서에서 온 값을 막아 보니 정상 작업의 56~62%가 함께 막혔다. 값이 문서에서 왔다는 것과 문서가 그 행동을 시켰다는 것은 다른 이야기다. (확정)

할 일을 다리로 쓴다. 에이전트는 도구를 부르기 직전에 할 일을 화면에 쓴다(MessageDisplay 훅). 호출을 직전 할 일에 잇고, 그 할 일이 무엇에서 나왔는지를 Jev에게 물어 이어 두면, 호출에서 거슬러 올라가 시작점에 닿을 수 있다. (확정)

사용자의 의도를 맞히려 하지 않는다. "사용자가 이걸 시켰나"를 직접 물으면 모호한 요청에서 점수가 0.5~0.7에 몰려 쓸 수가 없다. 그래서 글 두 개 사이의 좁은 관계만 묻는다. 반사실 재실행도 하지 않고, Jev에게는 문장 짝 하나로 된 예/아니오 질문만 맡긴다. (확정)

가장 가까운 연구인 ProvenanceGuard(ASE 2026)와는 두 가지가 다르다. 계획, 곧 할 일 자체가 어디서 왔는지까지 거슬러 올라가고, 행동을 시킬 수 있는 곳을 사용자가 준 일로 제한한다. (확정)

## 상태 표시

이 명세의 문단과 표에는 상태를 붙인다. **확정**은 인계 문서(2026년 10월 1일)에 정해진 것이다. **초안**은 명세 v0을 쓰면서 이번에 정한 것이고, 인계 문서가 스스로 초안이나 임시 값이라고 밝힌 것(Jev 질문 문구, 기준 점수 0.5)도 초안으로 둔다. **미정**은 아직 정하지 않은 것으로, [Open Questions](/docs/spec/open-questions/)에 모아 두었다.

## 엔진 구성

```text
 +----------------------+                    +----------------------+
 | Claude Code          |                    | agentgateway         |
 | hooks                |                    | MCP tools/call       |
 +----------+-----------+                    +-----------+----------+
            |  HTTP 127.0.0.1                            |  ext_authz
            |  POST /v1/hooks                            |  gRPC
            v                                            v
 +--------------------------------------------------------------------+
 | Engine Daemon                                                      |
 |                                                                    |
 |  +-----------+   +------------------+   +------------------------+ |
 |  | Collector |-->| Segment Analyzer |-->| Causal Structure Layer | |
 |  +-----------+   +------------------+   |   Call Parser          | |
 |                                         |   Token Index          | |
 |                                         |   Provenance Tracer    | |
 |                                         +-----------+------------+ |
 |                                                     |              |
 |                   +-----+   +-----------------+     |              |
 |                   | PEP |<--| Decision Module |<----+              |
 |                   +-----+   +-----------------+                    |
 |                                                                    |
 |  Shared                                                            |
 |  +-------------------------+   +-------------------------+         |
 |  | Jev Client              |   | Provenance Log          |         |
 |  | batching, cache         |   |                         |         |
 |  +------------+------------+   +------------+------------+         |
 +---------------|-----------------------------|----------------------+
                 v                             v
                Jev                          Redis
```

Claude Code 훅과 agentgateway가 Engine Daemon으로 이벤트를 보내면, 데몬 안에서 Collector, Segment Analyzer, 인과 구조 파악 계층(Call Parser, Token Index, Provenance Tracer), Decision Module, PEP가 차례로 일한다. Jev Client(질문 묶음, 캐시)와 Provenance Log(Redis)는 여러 모듈이 함께 쓰는 공통 기반이다. 막는 곳은 둘이다. 내장 도구는 PreToolUse 훅에서, MCP 도구는 agentgateway의 ext_authz에서 막는다. agentgateway는 ext_authz gRPC로 엔진에 판정을 묻는다. (확정)

훅은 127.0.0.1의 HTTP로 엔진에 이벤트를 보낸다. 엔진, Redis, agentgateway는 Docker로 로컬에서 띄운다. 엔진 코드는 OS를 구분하지 않으며, 1차 지원 대상은 macOS와 Linux다. (초안)

Jev가 어디서 돌고 엔진과 어떻게 연결되는지는 정하지 않았다. (미정)

## 이벤트 흐름

```text
 hook (Claude Code)
   |
   v
 Engine Daemon ............ 훅 이벤트와 ext_authz 요청을 받는다
   |
   v
 Collector ................ 순번을 매기고 노드를 만든다
   |
   v
 Segment Analyzer ......... 문단에 시키는 문장, 주제, 숨긴 글을 표시한다
   |
   v
 Causal Structure Layer
   Call Parser ............ 호출을 요소로 나눈다
   Token Index ............ 값이 글자 그대로 적힌 곳을 찾는다
   Provenance Tracer ...... 시작점을 찾아 Provenance Record를 만든다
   |
   v
 Decision Module .......... 통과, 차단, 묻기를 정한다
   |
   v
 PEP ...................... PreToolUse 훅이나 agentgateway ext_authz로 답한다
```

모든 이벤트가 끝까지 가지는 않는다. 판정까지 가는 것은 PreToolUse뿐이고, 나머지 훅은 판정에 쓸 재료를 그래프에 미리 쌓아 둔다.

| 이벤트 | 지나는 곳 | 하는 일 | 상태 |
|---|---|---|---|
| UserPromptSubmit | Engine Daemon → Collector | 요청을 Request 노드로 저장하고, 요청에서 사용자가 가리킨 문서(이슈, 붙여 넣은 글, 링크)를 기록해 둔다. | 확정 |
| MessageDisplay | Engine Daemon → Collector → Provenance Tracer | 할 일을 Task 노드로 저장하고, 호출을 기다리지 않고 그 부모를 미리 판단한다. | 확정 |
| TaskCreated | MessageDisplay와 같음 | 수집할지 정하지 않았다. | 미정 |
| PostToolUse | Engine Daemon → Collector → Segment Analyzer | tool_response를 문단으로 나눠 Segment 노드로 저장하고 원래 호출에 잇는다. 문단마다 시키는 문장, 주제, 숨긴 글을 표시한다. | 확정 |
| PreToolUse | Engine Daemon → Collector → 인과 구조 파악 계층 → Decision Module → PEP | 호출을 요소로 나누고 시작점을 찾아 판정한 뒤 훅에 답한다. | 확정 |
| ext_authz (agentgateway) | Engine Daemon → PEP | MCP 호출의 판정을 tool_use_id로 찾아 허용하거나 거부한다. | 확정 |

## 시간 제한

PreToolUse에 주어진 5초 가운데 엔진의 마감은 3초이고, Jev 한 번에는 1.5초까지 쓴다. 내장 도구가 통과일 때는 PreToolUse에 아무 응답도 하지 않는다. allow를 보내면 Claude Code의 원래 권한 확인을 건너뛰기 때문이다. MCP는 판정이 없으면 차단한다(fail closed). (확정)

훅 명령은 `curl -sf --max-time 4 ... || true` 꼴로 둔다. 엔진이 죽어 있어도 훅은 그대로 끝나고 원래 권한 확인으로 넘어간다. (초안)

## 1차 범위

10월 10일 IPI 환경 평가까지는 판정 없이 기록부터 쌓고, Jev 가정을 먼저 확인한 뒤 트레이서를 만든다. 순서는 수집기(1~2일), Jev 질문 확인(2일, 수집기와 겹쳐서), 최소 트레이서와 판정(3일), 막는 곳 연결과 평가(2일)다. 평가에서는 공격 차단율과 정상 작업 통과율을 잰다. (확정)

평가 전에는 Bash 파서의 heredoc과 함수 정의 처리, 오류 대응(responds_to와 ERROR는 1차에 기록만), 결과에서 계산된 값의 근거 확인, 사용자에게 묻는 세부 흐름을 하지 않는다. 평가에서는 묻기를 차단으로 센다. (확정)
