export interface WinningResult {
  drawNo: number;
  numbers: number[];
  date: string;
}

/**
 * 계산을 통해 현재(가장 최근) 로또 회차 번호를 구합니다.
 * 로또 1회: 2002년 12월 7일
 */
export const getLatestDrawNo = (): number => {
  const firstDrawDate = new Date('2002-12-07T21:00:00+09:00');
  const now = new Date();
  
  // 밀리초 차이를 주 단위로 변환
  const diffMs = now.getTime() - firstDrawDate.getTime();
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  
  return weeks + 1;
};

/**
 * 동행복권 API를 통해 특정 회차의 당첨 번호를 가져옵니다.
 * 브라우저 CORS 제한을 피하기 위해 proxy(allorigins)를 사용합니다.
 */
/**
 * 동행복권 API를 통해 특정 회차의 당첨 번호를 가져옵니다.
 * 브라우저 CORS 제한을 피하기 위해 proxy를 사용합니다.
 * 토요일 저녁(18:30~21:00)에는 서버 제한으로 인해 데이터 조회가 어려울 수 있습니다.
 */
export const fetchWinningNumbers = async (drawNo: number): Promise<WinningResult | null> => {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const now = new Date();
  const kstNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + KST_OFFSET);
  
  // 토요일 18:30 ~ 21:00 사이에는 동행복권 사이트가 간소화되어 API 접근이 안될 가능성이 높음
  const isSaturday = kstNow.getDay() === 6;
  const hours = kstNow.getHours();
  const minutes = kstNow.getMinutes();
  const isDrawTime = isSaturday && (
    (hours === 18 && minutes >= 30) || 
    (hours >= 19 && hours < 21)
  );

  const targetUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNo}`;
  
  // 시도할 프록시 리스트
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) continue;

      let result;
      if (proxyUrl.includes('allorigins')) {
        const data = await response.json();
        result = JSON.parse(data.contents);
      } else {
        result = await response.json();
      }

      if (result && result.returnValue === 'success') {
        return {
          drawNo: result.drwNo,
          numbers: [
            result.drwtNo1, result.drwtNo2, result.drwtNo3,
            result.drwtNo4, result.drwtNo5, result.drwtNo6
          ].sort((a, b) => a - b),
          date: result.drwNoDate
        };
      }
    } catch (e) {
      console.warn(`Proxy ${proxyUrl} failed:`, e);
    }
  }

  if (isDrawTime) {
    console.log('Currently in Saturday draw time. Official API might be restricted.');
  }
  
  return null;
};
