import axios from 'axios';

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

// 메모리 캐시를 통해 API 호출 횟수 최적화 및 안정성 확보
const winCache: Record<number, WinningResult> = {};

/**
 * 동행복권/미러 사이트를 통해 특정 회차의 당첨 번호를 가져옵니다.
 */
export const fetchWinningNumbers = async (drawNo: number): Promise<WinningResult | null> => {
  // 캐시 확인
  if (winCache[drawNo]) return winCache[drawNo];

  // 1순위: 매우 안정적이고 CORS가 허용된 GitHub Mirror (smok95.github.io)
  // 매주 토요일 저녁 추첨 후 수 분 내로 업데이트됨
  const mirrorUrl = `https://smok95.github.io/lotto/results/${drawNo}.json`;
  
  // 2순위: 공식 API (프록시 경유 필요)
  const officialUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNo}`;
  const isDev = import.meta.env.DEV;
  
  const sources = [
    { name: 'GitHub Mirror', url: mirrorUrl, isMirror: true },
    { 
      name: 'Official API (Proxy)', 
      url: isDev ? `/lotto-api?method=getLottoNumber&drwNo=${drawNo}` : `https://api.allorigins.win/get?url=${encodeURIComponent(officialUrl)}`,
      isMirror: false 
    },
    {
      name: 'Codetabs Proxy',
      url: `https://api.codetabs.com/v1/proxy?url=${encodeURIComponent(officialUrl)}`,
      isMirror: false
    }
  ];

  for (const source of sources) {
    try {
      const response = await axios.get(source.url, { timeout: 10000 });
      let data = response.data;

      // GitHub Mirror 파싱
      if (source.isMirror && data.draw_no) {
        const winningResult: WinningResult = {
          drawNo: data.draw_no,
          numbers: [...data.numbers].sort((a, b) => a - b),
          date: data.date.split('T')[0]
        };
        winCache[drawNo] = winningResult;
        return winningResult;
      }

      // Official API 파싱
      if (source.url && source.url.includes('allorigins') && data.contents) {
        data = JSON.parse(data.contents);
      } else if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
      }

      if (data && data.returnValue === 'success') {
        const winningResult: WinningResult = {
          drawNo: Number(data.drwNo),
          numbers: [
            Number(data.drwtNo1), Number(data.drwtNo2), Number(data.drwtNo3),
            Number(data.drwtNo4), Number(data.drwtNo5), Number(data.drwtNo6)
          ].sort((a, b) => a - b),
          date: data.drwNoDate
        };
        winCache[drawNo] = winningResult;
        return winningResult;
      }
    } catch (e: any) {
      // 에러 발생 시 다음 소스로 넘어감
    }
  }

  return null;
};
