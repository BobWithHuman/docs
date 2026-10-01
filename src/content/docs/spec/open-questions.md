---
title: Open Questions
description: 아직 정하지 않았거나 확인하지 못한 것을 모았다.
---

이 페이지의 질문은 모두 미정이다. 정해지면 해당 페이지의 상태를 바꾸고 여기서 지운다. 마지막의 알려진 약점은 질문이 아니라, 인계 문서가 이미 밝혀 둔 설계의 약한 곳이다.

## 정해야 할 것

**판정용 그래프를 어디에 둘지.** 판정에 쓰는 그래프를 Engine Daemon의 메모리에 두고, Redis는 기록과 복구용으로만 쓸지 정해야 한다. 이에 따라 엔진을 다시 띄웠을 때 무엇을 되살리는지도 달라진다. [Engine Daemon](/docs/spec/engine-daemon/), [Provenance Log](/docs/spec/shared/provenance-log/)에 걸린다.

**TaskCreated를 수집할지.** 할 일은 MessageDisplay로 받는데, 인계 문서는 할 일이 들어오는 이벤트로 TaskCreated도 함께 적어 두었다. 수집한다면 Task 노드를 어떻게 만들지, MessageDisplay로 들어온 할 일과 겹칠 때 어떻게 할지도 정해야 한다. [Collector](/docs/spec/shared/collector/), [Provenance Tracer](/docs/spec/causal-layer/provenance-tracer/)에 걸린다.

**"사슬의 최솟값"이 무엇의 최솟값인지.** Provenance Record에 이 필드가 있지만 무엇의 최솟값인지는 적혀 있지 않다. 판정 표의 "사슬 확신도"가 이 값을 가리키는지도 함께 정한다. [Provenance Record](/docs/spec/common-model/provenance-record/)에 걸린다.

**묻기 구간(±0.05)의 기준 점수.** 시작점이 DOC인데 사용자 요청도 함께 걸렸고 사슬 확신도가 기준 근처(±0.05)이면 사용자에게 묻는다. 이 구간의 가운데가 되는 기준 점수가 무엇인지, 간선을 잇는 기준 점수(지금은 임시로 0.5)와 같은 것인지 정해야 한다. [Decision Module](/docs/spec/decision-module/)에 걸린다.

**가져온 값과 새로 쓴 값을 가르는 기준.** Call Parser가 둘을 가르고, 새로 쓴 값은 뒤에서 따지지 않는다. 그런데 무엇을 기준으로 가르는지는 없다. [Call Parser](/docs/spec/causal-layer/call-parser/), [Value Types](/docs/spec/common-model/value-types/)에 걸린다.

**허용 조합 17개의 목록.** 간선은 허용된 (짝, 종류) 조합 17개 안에서만 만든다. 인계 문서에는 개수만 있고 목록은 없다. [Edges](/docs/spec/common-model/edges/)에 걸린다.

**훅별 필드 모양.** 훅마다 어떤 필드가 어떤 모양으로 오는지는 수집 기록을 본 뒤 확정한다. [Identifiers and Ordering](/docs/spec/common-model/identifiers-and-ordering/), [Nodes](/docs/spec/common-model/nodes/)에 걸린다.

## 아직 확인 못 한 것

인계 문서가 아직 확인하지 못했다고 적은 것들이다.

**Jev가 정상과 공격을 가르는지.** Jev가 advances, instructed_by, performs를 정상과 공격으로 실제로 가르는지 확인하지 못했다. 설계 전체가 이 가정에 걸려 있다. 지금까지 실제로 Jev에 물어 잰 점수는 몇 건뿐이고, Jev 질문 확인 단계에서 이를 본다.

**할 일을 말하는 비율.** 에이전트가 도구를 부르기 전에 할 일을 얼마나 자주 말하는지 모른다. 이 비율이 낮으면 "할 일 없음" 경로가 주가 된다.

**대화 모드의 이벤트 순서.** 대화 모드에서도 MessageDisplay가 호출보다 먼저 오는지 확인하지 못했다. 지금까지는 비대화 모드 25건만 확인했다.

**PostToolBatch, TaskCreated, InstructionsLoaded.** PostToolBatch가 묶음 경계에서 정확히 뜨는지, TaskCreated와 InstructionsLoaded의 필드 구조가 어떤지 확인하지 못했다.

**훅별 tool_response의 모양.** 예를 들어 Grep 결과가 글 한 덩어리로 오는지 객체로 오는지 모른다.

**ext_authz와 toolUseId.** ext_authz를 tools/call에만 걸 수 있는지, `claudecode/toolUseId`가 공식으로 약속된 필드인지 확인하지 못했다.

**Bash 파서.** heredoc과 함수 정의를 어떻게 처리할지 확인하지 못했다.

## 명세를 쓰며 드러난 빈칸

명세 v0을 모듈별로 나눠 쓰다 보니 인계 문서가 정하지 않은 것이 더 나왔다. 자세한 내용은 각 페이지의 "미정"에 있다.

**판정에 필요한 정의.** "민감한 행동"이 무엇인지 정의되어 있지 않다. 시작점이 DELEGATED여도 민감한 행동이면 묻는다는 규칙이 여기에 걸린다. 한 호출이 판정 표의 여러 줄에 걸릴 때의 우선순위도 없다.

**1차 숨긴 글.** 1차 판정 표에는 "시킨 문단이 숨긴 글이면 차단"이 있는데, 1차 Segment Analyzer 범위(시키는 문장 표시와 이슈 주제 규칙)에는 숨긴 글 표시가 없다. 화면에 보이는 모습을 무엇으로 얻는지도 정하지 않았다.

**Provenance Record에 담을 곳.** 판정이 쓰는 바깥 영향 판별 결과, 가져온 값마다의 확인 결과, 시킨 문단이 숨긴 글인지가 Record의 필드 목록에 따로 없다.

**그래프에 들어오는 모양.** 직전 오류, 사용자 자신의 설정 파일, 저장소 지침 파일을 어떤 노드로 나타낼지, 붙여 넣은 글이 따로 문단이 되는지 정하지 않았다. 문단을 나누는 규칙, 세션과 턴과 묶음의 경계, 식별자 형식도 없다. produced_by와 derived_from을 어느 모듈이 만드는지, 요청 때 가리킨 문서의 기록을 어느 모듈이 맡는지도 남아 있다.

**Jev 질문.** 수행 확인(performs)과 바깥 영향 질문은 묻는 내용만 있고 문구가 없다. "할 일 없음"일 때 호출을 어떤 후보와 어떤 간선으로 짝지어 묻는지도 없다. Jev가 어디서 돌고 엔진과 어떻게 연결되는지도 정하지 않았다.

**엔진 연결.** HTTP와 gRPC의 포트, 토큰 파일의 위치, Docker 안에서 엔진이 만든 토큰을 호스트의 훅 명령이 읽는 방법, 엔진 마감 3초를 넘겼을 때의 응답이 없다. MCP 호출에 오는 PreToolUse 훅에 무엇을 답할지, 묻기를 사용자에게 어떻게 전할지, 세 번 막힌 것을 어떻게 알릴지도 남아 있다.

## 알려진 약점

**그럴듯하게 이어 보이는 주입 지시.** 주입된 지시가 요청과 그럴듯하게 이어 보이면 advances 점수가 높게 나올 수 있다. instructed_by 우선순위와 값 확인으로 일부만 막는다.

**맡긴 문서 자체가 공격인 경우.** 공격자가 이슈 첫 문단에 지시를 쓰면 그 문단은 주제라서 DELEGATED가 된다. 최종 방어는 민감한 행동에서 사용자에게 묻는 것이다.

**바깥 영향을 잘못 본 경우.** 바깥 영향이 있는 호출을 "읽기만"으로 잘못 보면 검사 없이 통과한다. 답을 도구 이름 단위로 저장하면 인자에 따라 하는 일이 바뀌는 도구에서 틀릴 수 있다.

**EXPOSED가 너무 쉽게 켜짐.** EXPOSED는 되돌아가지 않아 긴 세션에서는 대부분 켜진다. README의 평범한 안내문도 시키는 문장이라서, Jev 응답 실패율이 높으면 묻기가 잦아진다.
