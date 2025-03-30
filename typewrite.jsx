/**
    * Hangul Typewriter Library for Adobe ExtendScript and General Use
    * @version 1.0.0
    * @description A library for handling Hangul text composition and typewriter effects in Adobe ExtendScript.
    * @license MIT
    * @author Pindang2
    * @date 2025-03-30
    * @usage hangulTypewriteSteps("안녕하세요"); // Returns an array of steps for typewriting the text "안녕하세요"
    * @example
    * var steps = hangulTypewriteSteps("안녕하세요"); //['ㅇ','아','안','안ㄴ','안녀','안녕','안녕ㅎ','안녕하','안녕핫','안녕하세','안녕하셍','안녕하세요']
    https://cdn.jsdelivr.net/gh/Pindang2-Scripts/extendscript-hangul-library@main/typewrite.jsx
*/
function hangulTypewriteVersion() { return '1.0.0'; }
function hangulComposeSteps(text){
    if (!text) return [];
    if (typeof text !== 'string') throw new TypeError('hangul text must be a string');
    if (text.length === 0) return [];
    if (text === ' ') return [' '];
    if (text.length > 1) throw new RangeError('hangul text must be a single character');
    
    var ChoSung = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    var JoongSung = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    var JongSung = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    
    // 복모음 매핑
    var complexVowelMap = {
        9: 8,   // ㅘ(9) -> ㅗ(8)
        10: 8,  // ㅙ(10) -> ㅗ(8)
        11: 8,  // ㅚ(11) -> ㅗ(8)
        14: 13, // ㅝ(14) -> ㅜ(13)
        15: 13, // ㅞ(15) -> ㅜ(13)
        16: 13, // ㅟ(16) -> ㅜ(13)
        19: 18, // ㅢ(19) -> ㅡ(18)
    };
    
    // 복모음 역매핑 (문자 -> 인덱스)
    var complexVowelReverseMap = {};
    for (var i = 0; i < JoongSung.length; i++) {
        complexVowelReverseMap[JoongSung[i]] = i;
    }
    
    // 복자음 종성 매핑
    var complexJongSungMap = {
        3: [1, 19],     // ㄳ -> ㄱ,ㅅ
        5: [4, 22],     // ㄵ -> ㄴ,ㅈ
        6: [4, 27],     // ㄶ -> ㄴ,ㅎ
        9: [8, 1],      // ㄺ -> ㄹ,ㄱ
        10: [8, 16],    // ㄻ -> ㄹ,ㅁ
        11: [8, 17],    // ㄼ -> ㄹ,ㅂ
        12: [8, 19],    // ㄽ -> ㄹ,ㅅ
        13: [8, 25],    // ㄾ -> ㄹ,ㅌ
        14: [8, 26],    // ㄿ -> ㄹ,ㅍ
        15: [8, 27],    // ㅀ -> ㄹ,ㅎ
        18: [17, 19]    // ㅄ -> ㅂ,ㅅ
    };
    
    // 복자음 역매핑 (문자 -> 인덱스)
    var complexJongSungReverseMap = {};
    for (var i = 0; i < JongSung.length; i++) {
        if (JongSung[i] !== "") {
            complexJongSungReverseMap[JongSung[i]] = i;
        }
    }

    // 자모 유니코드 범위
    var charCode = text.charCodeAt(0);
    
    // 단독 자모인지 확인 (초성, 중성, 종성)
    if (charCode >= 0x3131 && charCode <= 0x318E) {
        // 복모음인지 확인
        var joongIdx = complexVowelReverseMap[text];
        if (joongIdx !== undefined && complexVowelMap[joongIdx] !== undefined) {
            return [JoongSung[complexVowelMap[joongIdx]], text];
        }
        
        // 복자음인지 확인
        var jongIdx = complexJongSungReverseMap[text];
        if (jongIdx !== undefined && complexJongSungMap[jongIdx] !== undefined) {
            return [JongSung[complexJongSungMap[jongIdx][0]], text];
        }
        
        // 단순 자모
        return [text];
    }
    
    // 완성형 한글인지 확인
    if (charCode >= 44032 && charCode <= 55203) {
        var baseCode = 44032;
        var n = charCode - baseCode;
        var cho = Math.floor(n / 588);
        var joong = Math.floor((n % 588) / 28);
        var jong = n % 28;
        
        var steps = [];
        
        // 1. 초성 추가
        steps.push(ChoSung[cho]);
        
        // 2. 중성 조합 과정
        var baseJoong = complexVowelMap[joong];
        if (baseJoong !== undefined) {
            // 복모음인 경우, 기본 모음으로 먼저 조합
            steps.push(String.fromCharCode(baseCode + cho * 588 + baseJoong * 28));
        }
        
        // 3. 초성 + 중성 (완전한 중성)
        var syllableWithoutJong = String.fromCharCode(baseCode + cho * 588 + joong * 28);
        steps.push(syllableWithoutJong);
        
        // 4. 종성 추가 과정 (있는 경우)
        if (jong > 0) {
            // 복자음인 경우
            var jongParts = complexJongSungMap[jong];
            
            if (jongParts) {
                // 첫 번째 자음만 추가한 중간 단계
                steps.push(String.fromCharCode(baseCode + cho * 588 + joong * 28 + jongParts[0]));
            }
            
            // 최종 완성형
            steps.push(String.fromCharCode(baseCode + cho * 588 + joong * 28 + jong));
        }
        
        return steps;
    }
    
    // 그 외의 경우 (예: 영어, 숫자, 특수문자 등)
    return [text];
}
function hangulTypewriteSteps(text) {
    if (!text) return [];
    if (typeof text !== 'string') throw new TypeError('hangul text must be a string');
    if (text.length === 0) return [];
    if (text === ' ') return [' '];
    
    // ExtendScript에서는 indexOf가 지원되지 않을 수 있으므로 헬퍼 함수 추가
    function indexOf(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    }
    
    var ChoSung = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    var JoongSung = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    var JongSung = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    
    // 종성에서 초성으로 변환하는 매핑 테이블
    var jongToChoMap = {};
    for (var i = 0; i < ChoSung.length; i++) {
        for (var j = 0; j < JongSung.length; j++) {
            if (ChoSung[i] === JongSung[j]) {
                jongToChoMap[j] = i;
            }
        }
    }
    
    // 복자음 매핑 테이블 생성
    var doubleFinalConsonantsMap = {
        "1,19": 3,   // ㄱ,ㅅ -> ㄳ
        "4,22": 5,   // ㄴ,ㅈ -> ㄵ
        "4,27": 6,   // ㄴ,ㅎ -> ㄶ
        "8,1": 9,    // ㄹ,ㄱ -> ㄺ
        "8,16": 10,  // ㄹ,ㅁ -> ㄻ
        "8,17": 11,  // ㄹ,ㅂ -> ㄼ
        "8,19": 12,  // ㄹ,ㅅ -> ㄽ
        "8,25": 13,  // ㄹ,ㅌ -> ㄾ
        "8,26": 14,  // ㄹ,ㅍ -> ㄿ
        "8,27": 15,  // ㄹ,ㅎ -> ㅀ
        "17,19": 18  // ㅂ,ㅅ -> ㅄ
    };

    var complexJongSungMap = {
        3: [1, 19],     // ㄳ -> ㄱ,ㅅ
        5: [4, 22],     // ㄵ -> ㄴ,ㅈ
        6: [4, 27],     // ㄶ -> ㄴ,ㅎ
        9: [8, 1],      // ㄺ -> ㄹ,ㄱ
        10: [8, 16],    // ㄻ -> ㄹ,ㅁ
        11: [8, 17],    // ㄼ -> ㄹ,ㅂ
        12: [8, 19],    // ㄽ -> ㄹ,ㅅ
        13: [8, 25],    // ㄾ -> ㄹ,ㅌ
        14: [8, 26],    // ㄿ -> ㄹ,ㅍ
        15: [8, 27],    // ㅀ -> ㄹ,ㅎ
        18: [17, 19]    // ㅄ -> ㅂ,ㅅ
    };

    // 문자를 자모로 분해
    var jamoSequence = [];
    var baseCode = 44032; // '가'의 유니코드
    
    for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i);
        
        // 완성형 한글인 경우
        if (charCode >= 44032 && charCode <= 55203) {
            var n = charCode - baseCode;
            var cho = Math.floor(n / 588);
            var joong = Math.floor((n % 588) / 28);
            var jong = n % 28;
            
            jamoSequence.push(ChoSung[cho]);
            jamoSequence.push(JoongSung[joong]);
            if (jong > 0) {
                // 복자음인 경우 분리하여 추가
                if (complexJongSungMap[jong]) {
                    var jongParts = complexJongSungMap[jong];
                    jamoSequence.push(JongSung[jongParts[0]]);  // 첫번째 자음
                    jamoSequence.push(JongSung[jongParts[1]]);  // 두번째 자음
                } else {
                    jamoSequence.push(JongSung[jong]);  // 단일 종성
                }
            }
        }
        // 자모인 경우
        else if (charCode >= 0x3131 && charCode <= 0x318E) {
            jamoSequence.push(text[i]);
        }
        // 그외 문자
        else {
            jamoSequence.push(text[i]);
        }
    }
    
    var result = [];
    var curState = "";
    var curCho = -1;
    var curJoong = -1;
    var curJong = 0;  // 0은 종성 없음
    
    for (var i = 0; i < jamoSequence.length; i++) {
        var jamo = jamoSequence[i];
        var isConsonant = indexOf(ChoSung, jamo) !== -1 || (indexOf(JongSung, jamo) !== -1 && jamo !== "");
        var isVowel = indexOf(JoongSung, jamo) !== -1;
        
        // 띄어쓰기 처리 - 새로운 상태 시작
        if (jamo === ' ') {
            curState += ' ';
            result.push(curState);
            
            // 상태 초기화 (새 단어 시작 준비)
            curCho = -1;
            curJoong = -1;
            curJong = 0;
            continue;
        }

        // 초성+중성+종성 상태에서 자음이 들어오면 복자음 가능성 확인
        if (curCho !== -1 && curJoong !== -1 && curJong > 0 && isConsonant) {
            var newJongIdx = indexOf(JongSung, jamo);
            var choIdx = indexOf(ChoSung, jamo);
            
            if (newJongIdx !== -1) {
                // 복자음 가능성 확인
                var doubleKey = curJong + "," + newJongIdx;
                var doubleJongIdx = doubleFinalConsonantsMap[doubleKey];
                
                if (doubleJongIdx !== undefined) {
                    // 복자음 처리
                    curJong = doubleJongIdx;
                    var syllable = String.fromCharCode(baseCode + curCho * 588 + curJoong * 28 + curJong);
                    curState = curState.substring(0, curState.length - 1) + syllable;
                    result.push(curState);
                    continue;
                }
            }
            
            // 복자음이 아니거나 존재하지 않는 복자음인 경우 새 음절 시작
            if (choIdx !== -1) {
                // 새로운 음절 시작
                curCho = choIdx;
                curJoong = -1;
                curJong = 0;
                curState += jamo;
                result.push(curState);
                continue;
            }
        }
        
        // 초성+중성 상태에서 자음이 들어오면 종성 처리
        if (curCho !== -1 && curJoong !== -1 && curJong === 0 && isConsonant) {
            var jongIdx = indexOf(JongSung, jamo);
            if (jongIdx !== -1) {
                curJong = jongIdx;
                var syllable = String.fromCharCode(baseCode + curCho * 588 + curJoong * 28 + curJong);
                curState = curState.substring(0, curState.length - 1) + syllable;
                result.push(curState);
                continue;
            } else {
                // 초성으로 사용할 수 있는 자음인 경우 새 음절 시작
                var choIdx = indexOf(ChoSung, jamo);
                if (choIdx !== -1) {
                    curCho = choIdx;
                    curJoong = -1;
                    curJong = 0;
                    curState += jamo;
                    result.push(curState);
                    continue;
                }
            }
        }
        
        // 초성 상태에서 모음이 들어오면 중성 결합
        if (curCho !== -1 && curJoong === -1 && isVowel) {
            curJoong = indexOf(JoongSung, jamo);
            var syllable = String.fromCharCode(baseCode + curCho * 588 + curJoong * 28);
            curState = curState.substring(0, curState.length - 1) + syllable;
            result.push(curState);
            continue;
        }
        
        // 새로운 음절 시작 (초성)
        if (isConsonant && indexOf(ChoSung, jamo) !== -1) {
            curCho = indexOf(ChoSung, jamo);
            curJoong = -1;
            curJong = 0;
            curState += jamo;
            result.push(curState);
            continue;
        }
        
        // 새로운 음절 시작 (중성 - 앞 음절이 종성을 가진 경우)
        if (isVowel && curCho !== -1 && curJoong !== -1 && curJong > 0) {
            var newCho = -1;
            var remainingJong = 0;
            
            // 복자음인지 확인
            if (complexJongSungMap[curJong]) {
                // 복자음인 경우 (예: ㄺ -> ㄹ, ㄱ)
                var jongParts = complexJongSungMap[curJong];
                remainingJong = jongParts[0]; // 앞 자음은 종성으로 남김
                newCho = jongToChoMap[jongParts[1]]; // 뒷 자음은 초성으로
            } else {
                // 단자음인 경우 해당 자음을 초성으로 이동
                newCho = jongToChoMap[curJong];
                remainingJong = 0; // 종성 제거
            }
            
            if (newCho !== undefined) {
                // 이전 음절 처리 (종성 변경 또는 제거)
                var prevSyllable = String.fromCharCode(baseCode + curCho * 588 + curJoong * 28 + remainingJong);
                
                // 새 음절 생성
                var newJoong = indexOf(JoongSung, jamo);
                var newSyllable = String.fromCharCode(baseCode + newCho * 588 + newJoong * 28);
                
                // 상태 업데이트
                curState = curState.substring(0, curState.length - 1) + prevSyllable + newSyllable;
                
                // 현재 상태 업데이트
                curCho = newCho;
                curJoong = newJoong;
                curJong = 0;
                
                result.push(curState);
                continue;
            }
        }
        
        // 단순 추가
        curState += jamo;
        result.push(curState);
    }
    
    return result;
}