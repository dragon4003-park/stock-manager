# 소모품 관리 시스템 (PWA + Supabase)

> 팀 공유 가능한 실시간 소모품 재고 관리 앱

---

## 포함 파일

| 파일 | 역할 |
|------|------|
| `schema.sql`   | Supabase DB 스키마 (1회 실행) |
| `manifest.json`| PWA 앱 메타정보 |
| `sw.js`        | 서비스 워커 (오프라인 지원) |
| `index.html`   | 메인 앱 (이 파일 하나로 실행) |
| `icon-192.png` | 앱 아이콘 192×192 |
| `icon-512.png` | 앱 아이콘 512×512 |

---

## 구축 순서 (4단계, 약 1시간)

### Step 1. Supabase 프로젝트 생성
1. https://supabase.com 접속 → 회원가입
2. "New Project" 클릭 → 이름/비밀번호 입력 → 가까운 리전 선택
3. 프로젝트 생성 완료까지 약 1~2분 대기

### Step 2. 데이터베이스 스키마 적용
1. Supabase Dashboard → 좌측 메뉴 **SQL Editor** → **New Query**
2. `schema.sql` 전체 내용 복사 → 붙여넣기 → **Run** 클릭
3. 성공 메시지 확인

### Step 3. Realtime 활성화
1. Supabase Dashboard → **Database** → **Replication**
2. 아래 테이블의 토글을 **ON** 으로 설정:
   - `stock_balance`
   - `stock_inbound`
   - `stock_outbound`
   - `stock_alerts`

### Step 4. GitHub Pages 배포 (무료)
1. GitHub 계정 생성 → 새 Repository 생성 (Public)
2. 이 ZIP의 모든 파일을 Repository에 업로드
3. Settings → Pages → Source: **main branch** → Save
4. 약 1분 후 `https://{계정명}.github.io/{저장소명}/` 으로 접속
5. 처음 접속 시 나타나는 설정 화면에서:
   - **Project URL**: Supabase Dashboard → Settings → API → Project URL
   - **Anon Key**: Supabase Dashboard → Settings → API → anon public
   - **내 이름**: 처리자 이름 (예: 홍길동)

---

## 팀원 공유 방법

배포 URL을 팀원에게 공유하면 됩니다.  
**각자 처음 접속 시 동일한 Supabase URL과 Anon Key 입력** → 같은 DB 사용

---

## 앱 설치 방법 (PWA)

| 기기 | 방법 |
|------|------|
| **iPhone / iPad** | Safari로 접속 → 하단 공유 버튼 → "홈 화면에 추가" |
| **Android** | Chrome으로 접속 → "앱 설치" 배너 또는 메뉴 → "홈 화면에 추가" |
| **PC (Chrome)** | 주소창 우측 설치 아이콘 클릭 |

---

## 기능 요약

- **재고현황**: 전체/분류/상태별 필터, 재고 바 시각화, 경고 색상 강조
- **입출고 처리**: 실시간 재고 미리보기, 재고 부족 시 자동 경고 알림
- **품목 관리**: 품목 등록/삭제, 신규 분류 즉석 생성
- **거래내역**: 전체 입출고 이력 조회
- **실시간 동기화**: 팀원이 입력한 변경사항이 즉시 반영
- **오프라인 지원**: 인터넷 없이도 앱 화면 표시 (데이터 조회 불가)
- **PWA**: 스마트폰 홈 화면에 앱 아이콘으로 설치

---

## Supabase 무료 플랜 한도

| 항목 | 무료 한도 |
|------|-----------|
| DB 용량 | 500 MB |
| 월간 API 요청 | 500만 건 |
| 동시 접속자 | 200명 |
| Realtime 메시지 | 200만 건/월 |

소규모 팀(~30명)에서는 무료 플랜으로 충분합니다.
