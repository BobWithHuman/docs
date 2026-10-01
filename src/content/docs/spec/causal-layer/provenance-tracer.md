---
title: Provenance Tracer
description: 할 일과 호출을 부모에 잇고, 호출에서 거슬러 올라가 시작점을 찾아 Provenance Record를 만든다.
sidebar:
  order: 3
---

## 하는 일

Provenance Tracer는 두 때에 일한다. 할 일이 들어오면 그 할 일의 부모를 미리 판단해 두고, 호출이 들어오면 호출을 할 일에 이은 뒤 시작점을 찾아 Provenance Record를 만든다. (확정)

### 할 일이 들어올 때

MessageDisplay로 할 일이 들어오면 호출을 기다리지 않고 부모를 미리 판단한다. 후보마다 물을 간선이 하나씩 정해져 있어서 후보 하나에 질문 하나를 묶어 보내고, 기준 점수를 넘은 간선은 모두 잇는다. (확정)

| 후보 | 범위 | 간선 | 상태 |
|---|---|---|---|
| 사용자 요청 | 같은 세션의 최근 요청 5개와 맡긴 문서의 주제 | advances | 확정 |
| 앞선 할 일 | 같은 턴의 앞선 할 일 5개 | substep_of | 확정 |
| 시키는 문단 | 시키는 문장 표시가 붙은 문단 10개. 세션이 EXPOSED일 때만 넣는다 | instructed_by | 확정 |
| 직전 오류 | 바로 앞 묶음의 오류 | responds_to | 확정 |

### 호출이 들어올 때

PreToolUse 처리는 여섯 단계다. Call Parser가 호출을 요소로 나누고(1단계) Token Index가 값이 적힌 곳을 찾으면(2단계), Provenance Tracer가 나머지 네 단계를 이어서 한다. (확정)

**할 일과 잇기.** 호출을 같은 턴, 같은 묶음의 직전 할 일에 performs로 잇는다. 여기에는 Jev를 쓰지 않는다. 할 일이 아직 없으면 100ms를 기다리고, 그래도 없으면 "할 일 없음"으로 두었다가 시작점을 찾을 때 호출을 후보와 직접 짝지어 묻는다. (확정)

**바깥 영향 거르기.** 호출이 파일이나 설정을 바꾸는지, 무언가를 밖으로 보내는지, 실행하는지를 Jev에게 묻는다. 답은 도구 이름 단위로 저장하고, Bash는 명령 앞부분 단위로 저장한다. 읽기만 하는 호출은 더 따지지 않고 기록만 한다. 여기서 틀리면 뒤의 검사가 모두 건너뛰어지므로, 애매하면 "영향 있음" 쪽으로 기울인다. MCP 서버가 스스로 밝히는 읽기 전용 표시나 도구 설명은 서버가 쓴 글이라 그대로 믿지 않는다. (확정)

**시작점 찾기.** 먼저 호출이 그 할 일을 정말 수행하는지 Jev로 확인하고, 어긋나면 performs를 끊는다. 그다음 제어 의존 간선을 따라 올라가 시작점을 찾고, 마지막으로 가져온 값마다 근거를 확인한다. 값 확인 규칙은 [Value Types](/docs/spec/common-model/value-types/#가져온-값의-확인)에 있다. (확정)

**기록.** 결과를 Provenance Record로 정리해 Decision Module에 넘긴다. (확정)

### 시작점 규칙

호출에서 출발해 performs와 substep_of를 만나면 계속 올라가고, advances, instructed_by, responds_to를 만나면 멈춘다. 멈춘 곳이 시작점이다. (확정)

한 할 일에서 여러 간선이 기준을 넘으면 instructed_by, responds_to, substep_of, advances 순으로 따라간다. 행동을 더 구체적으로 지정한 쪽이 먼저다. 같은 종류가 여럿이면 점수가 높은 쪽을 따라간다. 따라가지 않은 쪽은 점수와 같이 "함께 걸린 후보"로 남기는데, 판정에서 "문서와 사용자 요청이 함께 걸려 묻는" 경우를 가리는 데 쓰인다. 어느 후보도 기준에 못 미치면 시작점은 SELF, Jev 응답을 받지 못하면 UNRESOLVED다. (확정)

substep_of가 advances보다 앞서는 데는 까닭이 둘 있다. 잘게 쪼갠 단계는 요청과 직접 비교하면 점수가 낮게 나올 수 있는데, substep_of가 있으면 앞선 할 일을 거쳐 요청까지 올라갈 수 있다. 또 문서가 시킨 할 일을 잘게 쪼개 무해해 보이게 만드는 세탁도 막는다. (확정)

예를 들어 요청(advances 0.88)과 이슈 주제(advances 0.74)가 함께 기준을 넘으면 요청을 따라가고, 이슈 주제는 함께 걸린 후보로 남긴다. 둘 다 사용자가 준 일이라 판정은 같다. 여기 나온 점수는 예시 값이다. (확정)

### 1차 범위

1차에는 할 일 잇기, 바깥 영향 판별, 부모 미리 판단, 시작점 찾기, Provenance Record까지 만든다. 직전 오류(responds_to)와 시작점 ERROR는 1차에 기록만 하고, 결과에서 계산된 값의 근거 확인은 평가 뒤로 미룬다. (확정)

## 받는 것

Request, Task, Segment 노드와 요청 때 기록해 둔 맡긴 문서, Segment Analyzer가 문단에 붙인 표시(시키는 문장, 주제, 숨긴 글), 세션 상태(CLEAN, EXPOSED), Call Parser가 만든 Call과 Element, Token Index가 만든 value_from 간선, 그리고 Jev Client를 거쳐 받은 Jev 점수를 받는다. (확정)

## 내놓는 것

performs, substep_of, advances, instructed_by, responds_to 간선을 만든다. 노드는 만들지 않는다. (확정) derived_from을 언제 만드는지는 정하지 않았다. (미정)

Provenance Record를 만들어 모든 필드를 채운다. 호출·요소, 할 일과 수행 점수, 사슬, 시작점, 함께 걸린 후보, 사슬의 최솟값, 세션 상태, 판단 못 한 이유다. (확정)

## Jev 질문

질문은 모두 "이 문장이 맞는가" 꼴의 진술문 하나로 묻고 앞뒤 대화는 넣지 않는다([Jev Client](/docs/spec/shared/jev-client/)). (확정) 질문 문구는 모두 초안이고, 기준 점수 0.5는 임시 값이다. (초안)

| 묻는 때 | 질문 | 상태 |
|---|---|---|
| 부모 판단: 사용자 요청 (advances) | `Doing "할 일" is a step toward completing: "요청"` | 초안 |
| 부모 판단: 앞선 할 일 (substep_of) | `"할 일" is part of "앞선 할 일"` | 초안 |
| 부모 판단: 시키는 문단 (instructed_by) | `The following text asks the reader to do "할 일": "문단"` | 초안 |
| 부모 판단: 직전 오류 (responds_to) | `"할 일" is a response to this error: …` | 초안 |
| 값 확인: 문단에서 온 값 | `"값" is something the user referred to in "요청"` | 초안 |
| 값 확인: 글자 그대로 없는 값 | `"값" is taken from this output` | 초안 |
| 수행 확인 (performs) | 문구 없음 | 미정 |
| 바깥 영향 | 문구 없음. 묻는 내용(파일·설정 변경, 밖으로 보냄, 실행)은 확정 | 미정 |
| "할 일 없음"일 때 호출과 후보 | 문구 없음 | 미정 |

advances를 "요청에 들어 있나"가 아니라 "진행시키는가"로 묻는 것은, 요청이 대개 뭉뚱그려 말하기 때문이다. "이슈를 먼저 읽는다" 같은 중간 단계는 요청에 글자로 나오지 않는다. (확정)

## 미정

"사슬의 최솟값"이 무엇의 최솟값인지, derived_from을 언제 만드는지, "할 일 없음"일 때 호출을 어떤 후보와 어떤 간선으로 짝지어 묻는지를 정하지 않았다. 수행 확인과 바깥 영향 질문은 문구가 없다. Bash의 "명령 앞부분"을 어디까지로 볼지도 남아 있다.

알려진 약점도 있다. 바깥 영향 답을 도구 이름 단위로 저장하면, 인자에 따라 하는 일이 바뀌는 도구에서 틀릴 수 있다. 주입 지시가 요청과 그럴듯하게 이어 보이면 advances 점수가 높게 나올 수 있는데, instructed_by 우선순위와 값 확인으로는 일부만 막는다([Open Questions](/docs/spec/open-questions/#알려진-약점)).
