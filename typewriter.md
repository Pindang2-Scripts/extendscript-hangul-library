# ExtendScript Hangul Library

## 소개 (Introduction)

ExtendScript Hangul Library는 Adobe ExtendScript 환경에서 한글 텍스트의 자모 분해와 조합, 그리고 타이프라이터 효과를 쉽게 구현할 수 있게 해주는 라이브러리입니다. 특히 After Effects에서 한글 텍스트 애니메이션을 만들 때 유용하게 사용할 수 있습니다.

## 설치 (Installation)

1. GitHub에서 직접 다운로드:
   - [extendscript-hangul-library](https://github.com/Pindang2-Scripts/extendscript-hangul-library) 저장소 방문 후 다운로드

2. 또는 CDN 또는 로컬 파일을 통해 스크립트를 불러오기 (Include가 지원되지 않으므로 파일을 문자열로 읽어온 후 메인 코드에서 eval합니다):
   ```javascript
   // CDN 예제:
   function getScriptFromURL(url) {
       // ...existing code for curl or HTTP 요청...
       var response = /* code to fetch URL content as string */;
       return response;
   }
   // 사용 예:
   var scriptContent = getScriptFromURL("https://cdn.jsdelivr.net/gh/Pindang2-Scripts/extendscript-hangul-library@main/typewrite.jsx");
   eval(scriptContent);

   // 로컬 파일 예제:
   function getScriptFromFile(filepath) {
       var file = new File(filepath);
       file.encoding = "UTF8";
       file.open("r");
       var content = file.read();
       file.close();
       return content;
   }
   // 사용 예:
   var fileScript = getScriptFromFile("./extendscript-hangul-library/typewrite.jsx");
   eval(fileScript);
   ```

## API 레퍼런스 (API Reference)

### hangulTypewriteVersion()
현재 라이브러리 버전을 반환합니다.
```javascript
var version = hangulTypewriteVersion(); // '1.0.0' 반환
```

### hangulComposeSteps(text)
한글 한 글자의 자모 조합 단계를 배열로 반환합니다.

**매개변수:**
- `text` (String): 한글 한 글자 (단일 문자)

**반환값:**
- Array: 자모 조합 단계들의 배열

**예외:**
- `TypeError`: text가 문자열이 아닌 경우
- `RangeError`: text가 한 글자 이상인 경우

### hangulTypewriteSteps(text)
주어진 텍스트의 타이프라이터 효과 단계를 배열로 반환합니다.

**매개변수:**
- `text` (String): 한글 문자열 (여러 글자 가능)

**반환값:**
- Array: 타이프라이터 효과의 각 단계별 문자열 배열

## 사용 예제 (Usage Examples)

### 기본 사용법

```javascript
// 한글 텍스트의 타이프라이터 단계 가져오기
var steps = hangulTypewriteSteps("안녕하세요");
// 결과: ['ㅇ','아','안','안ㄴ','안녀','안녕','안녕ㅎ','안녕하','안녕핫','안녕하세','안녕하셍','안녕하세요']

// 한 글자의 조합 단계 가져오기
var charSteps = hangulComposeSteps("한");
// 결과: ['ㅎ', '하', '한']
```

### After Effects에서 활용하기

```javascript
// 파일 내용 읽어오기 및 eval 예제:
var fileScript = getScriptFromFile("./extendscript-hangul-library/typewrite.jsx");
eval(fileScript);

function applyKRTypewriter(textLayer, durationPerStep) {
    var text = textLayer.sourceText.value.text;
    var steps = hangulTypewriteSteps(text);
    
    for (var i = 0; i < steps.length; i++) {
        var time = i * durationPerStep;
        textLayer.sourceText.setValueAtTime(time, new TextDocument(steps[i]));
    }
}

// 사용 예:
// var layer = app.project.activeItem.selectedLayers[0];
// applyKRTypewriter(layer, 0.1); // 각 단계마다 0.1초 간격
```

## 라이선스 (License)

MIT 라이선스에 따라 배포됩니다.

## 제작자 정보 (Author)

- 제작: Pindang2 Scripts
- 버전: 1.0.0
- 최종 업데이트: 2025-03-30

---

이 라이브러리는 한글의 자모 분해와 조합 특성을 고려하여 자연스러운 타이프라이터 효과를 구현할 수 있도록 설계되었습니다. 특히 복자음(ㄳ, ㄵ 등)과 복모음(ㅘ, ㅙ 등)의 조합 과정을 단계별로 표현할 수 있습니다.