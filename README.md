# 듀오해듀오
![Frame 9125](https://user-images.githubusercontent.com/86117661/192491788-2784249c-6367-45d6-bd2a-7b46acc5814a.jpg)


듀오해듀오는 내 플레이스타일 기반 찰떡 듀오를 매칭해주는 서비스에요

1️⃣ 롤비티아이 기반 알고리즘으로 찰떡 듀오를 매칭해드려요 🤝  
2️⃣ 전적만으로 알 수 없었던 플레이스타일과, 실제 듀오후기도 확인해보세요 👀  
3️⃣ 실시간으로 듀오를 찾고 있는 소환사도 만날 수 있어요  
4️⃣ 마음에 드는 소환사가 있다면, 바로 1:1 채팅으로 롤약속을 잡아보세요  

아래 링크를 클릭하면 롤비티아이 검사와 3초 안에 회원가입이 가능해요!  
심심하실 때 가입해주시면 정말 감사드리겠습니당  
(어쩌면 알고리즘으로 절 만나실 수도..? 😋)  

👉듀오해듀오 바로가기  
 [https://duoduo.lol/tendency-test?type=direct](https://duoduo.lol/tendency-test?type=direct)

## 1️⃣ 프로젝트 기간

2022.07 ~ 2022.08 (6주)

## 2️⃣ 서비스 화면

### 온보딩 및 롤비티아이(플레이스타일 검사)

![duo-tendency_test](https://user-images.githubusercontent.com/78065948/219393510-2e815669-17a1-4508-ad47-735b3d3c42d4.gif)

### 홈

![duo-home](https://user-images.githubusercontent.com/78065948/219356198-e50e47c8-10f7-4e07-bb18-0b9e9fc8faab.gif)

### 맞춤 추천 소환사

![duo-recommendjpg](https://user-images.githubusercontent.com/78065948/219357409-00ead885-e31a-45c9-8ac8-92e35d084001.jpg)

### 최신 소환사

![duo-recommend_new](https://user-images.githubusercontent.com/78065948/219357502-e9a40c31-00fa-4c33-8949-060b010ee262.gif)

### 유저 프로필

![duo-profile](https://user-images.githubusercontent.com/78065948/219356502-0c8be51d-bea4-4dca-94a6-17e69882987d.gif)

### 전적

![duo-match_history](https://user-images.githubusercontent.com/78065948/219356897-c51a30a9-c6ba-4aa9-8f08-60271c0a6b21.gif)

### 채팅

![duo-chat](https://user-images.githubusercontent.com/78065948/219401185-7d7378b2-b5c3-4916-8ef3-e1ed22b856a6.gif)
![duo-chat_notice](https://user-images.githubusercontent.com/78065948/219405808-c85157c9-0826-47cf-adcf-6526faabbce3.gif)

### 리뷰 작성

![duo-review_positive](https://user-images.githubusercontent.com/78065948/219357204-b034cb29-a4ef-4d2e-bbc5-10ca03360e83.jpg)
![duo-review_netgative](https://user-images.githubusercontent.com/78065948/219357088-df57f6d4-7471-44fe-aadc-562f31113618.jpg)
![duo-review_complete](https://user-images.githubusercontent.com/78065948/219357079-f5935ebe-52bd-4744-8dfe-5bd43e9f2935.jpg)

### 마이 페이지

![duo-mypage](https://user-images.githubusercontent.com/78065948/219357746-e8023ae9-d3b9-4595-9846-d061b91d4e9b.jpg)

### 회원 탈퇴

![duo-withdrawl](https://user-images.githubusercontent.com/78065948/219358154-5486a575-0e3b-4b4f-bdb4-1587e28ee4cf.jpg)

### 로그인

![duo-login](https://user-images.githubusercontent.com/78065948/219358224-f78fd02e-eea9-41d2-b824-e62b004e568a.jpg)

### 비로그인 화면

![duo-home_blured](https://user-images.githubusercontent.com/78065948/219356714-fe0740ad-e473-4365-82fa-8a42033b8ecb.jpg)
![duo-profile_blured](https://user-images.githubusercontent.com/78065948/219358384-ba758fc4-c933-47da-8c16-b81f21d49607.jpg)
![image](https://user-images.githubusercontent.com/78065948/219359026-8b99cc03-34df-4597-872b-b6b2dcf0bd4d.png)

### 404

![duo-404](https://user-images.githubusercontent.com/78065948/219358353-2bd1ffcb-6c49-458e-87bf-b5dcfdd026ef.jpg)

## 3️⃣ **Service Architecture**

<img width="1000" alt="Frame 1" src="https://user-images.githubusercontent.com/86117661/192491728-616c0644-a871-464c-b170-280d89f66e31.png">


## 4️⃣ **BE Core Tools**

![image](https://user-images.githubusercontent.com/86117661/192492011-f3fb4f3d-b131-49f6-8c08-3bf3e5e9baaf.png)


### **Library**

![image](https://user-images.githubusercontent.com/86117661/200250200-09cfdf5a-e790-43c4-ae59-20c36ad0ed35.png)


## 5️⃣ Trouble Shooting

### issue 1

### 🤔 situation

- 로그인 시 서버에서 Set-cookie 해준 쿠키를 클라이언트에서 꺼내서 로그인 여부를 판별하고 싶었는데, 사용할 수 없었음
- 개발자 도구의 Network탭에서 Request cookies에는 잘 왔다갔다 하는게 보였으나 Application탭의 cookie, 즉 클라이언트의 브라우저에는 저장이 되지 않아 사용할 수 없었음

### 😙 solution

- httpOnly, secure, domain, samesite 등 Set-cookie의 옵션들을 다양하게 바꾸어 보았지만 원하는 방식대로 작동하지 않음
- → 서버와 클라이언트의 도메인이 달라 서버 측 도메인에 쿠키가 저장되고 있었음
- → 여전히 클라이언트에서 그 쿠키를 사용할 순 없었기에 클라이언트 주소인 [https://duoduo.lol](https://duoduo.lol에)의 하위 도메인인  [https://server.duoduo.lol](https://server.duoduo.lol로)로 서버 주소를 이전함
- → 원하던 대로 네트워크 헤더에도, 브라우저 쿠키에도 둘 다 저장이 됨!

### issue 2

### 🤔 situation

- 하루에 한번 나의 플레이스타일에 맞는 유저 3명을 추천해주는 가장 중요한 API가 있었는데, 모든 유저를 불러와서 알고리즘을 적용시키는 것은 말도 안되는 방법이었기에 DB에서 가져올 때 애초에 3명을 뽑아와야 했는데 이전 프로젝트를 하면서 익숙해진 mySQL이 아닌 mongoDB를 사용하였기에 그 방법이 떠오르지 않음

### 😙 solution

- 오랜 검색 끝에 mongoose의 aggregate를 사용하여 해결
- 이 때 mongoDB도 mySQL처럼 관계형은 아니지만, 관계형처럼 사용할 수 있는 방법이 많다는 것을 알아냄

### issue 3

### 🤔 situation

- 최근 전적을 불러올 때,  유저고유ID를 통해 MongoDB에서 해당 유저의 롤 닉네임을 가져온 뒤, axios를 이용하여 riot api와 통신하여 소환사 데이터를 받고, 받은 데이터에서 소환사 puuid를 가지고 다시 한번 riot api와 통신하여 매치id 리스트를 100개를 받아왔다. 그 후 최근 전적 페이지네이션에 따라 5개씩 또 riot api와 통신해서 각 매치의 정보를 받아왔다. 최근전적 5개를 가져올 때 axios통신만 7번씩 해야해서 응답속도가 너무 오래걸렸고 유저에게 불편한 경험을 줄 것 같았다.

### 😙 solution

- redis를 이용하여 캐싱을 해서 해결
- 캐시 데이터가 만료되기 전까지는 응답속도를 평균 **3.03 s → 389 ms** 로 88%가량 단축시켰다.

## 6️⃣ Members

![image](https://user-images.githubusercontent.com/86117661/192492220-127f37ac-077e-4a63-80e5-8adb4133728d.png)
