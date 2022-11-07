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

## 2️⃣ 깃허브 링크

[https://github.com/gnar-rengar/backend](https://github.com/gnar-rengar/backend)

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

## 6️⃣ Members

![image](https://user-images.githubusercontent.com/86117661/192492220-127f37ac-077e-4a63-80e5-8adb4133728d.png)
