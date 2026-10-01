# Commit Convention

커밋 메시지는 아래 형식을 따릅니다.

<type>: <description>

예시:

feat: add policy evaluator
fix: handle llm timeout
chore: initialize repository structure
docs: update architecture document
test: add evaluator unit tests
refactor: simplify decision flow
ci: add rustfmt and clippy checks

---

## Type

### feat

새로운 기능을 추가할 때 사용합니다.

예:

feat: add policy evaluator
feat: implement grpc request handler

---

### fix

버그를 수정할 때 사용합니다.

예:

fix: handle invalid tool arguments
fix: return deny on llm timeout

---

### chore

기능 구현과 직접적인 관련이 없는 작업에 사용합니다.

예:

chore: initialize repository structure
chore: update dependencies
chore: configure issue templates

---

### docs

문서만 변경할 때 사용합니다.

예:

docs: update README
docs: add engine architecture

---

### test

테스트 코드를 추가하거나 수정할 때 사용합니다.

예:

test: add fail-closed test cases
test: add policy evaluator unit tests

---

### refactor

기능 변화 없이 코드 구조를 개선할 때 사용합니다.

예:

refactor: simplify decision flow
refactor: extract llm client interface

---

### ci

CI/CD 관련 설정을 추가하거나 수정할 때 사용합니다.

예:

ci: add rustfmt check
ci: add cargo deny workflow
ci: configure docker image build

---

### build

빌드 시스템이나 빌드 의존성을 변경할 때 사용합니다.

예:

build: update cargo configuration
build: add multi-stage docker build

---

## 작성 규칙

- 커밋 메시지는 영어로 작성합니다.
- type은 소문자로 작성합니다.
- description은 간결하게 작성합니다.
- description 끝에 마침표를 붙이지 않습니다.
- 하나의 커밋에는 하나의 논리적인 변경만 포함합니다.
- 의미 없는 메시지는 사용하지 않습니다.

좋은 예:

feat: add tool call evaluator
fix: handle malformed llm response
ci: add basic rust checks

피해야 할 예:

update
fix
test
asdf
working
final
