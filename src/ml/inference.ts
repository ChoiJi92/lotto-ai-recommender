import * as ort from 'onnxruntime-web';
import type { NextDrawFeatures, PredictionResult } from './types';
import { ML_CONFIG } from './constants';
export type RecommendStrategy = 'balanced' | 'stable' | 'challenge';

ort.env.wasm.numThreads = 1;

let rfSession: ort.InferenceSession | null = null;
let xgbSession: ort.InferenceSession | null = null;
let featuresCache: NextDrawFeatures | null = null;

async function loadModel(path: string): Promise<ort.InferenceSession> {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  return ort.InferenceSession.create(new Uint8Array(arrayBuffer), {
    executionProviders: ['wasm'],
  });
}

async function loadFeatures(): Promise<NextDrawFeatures> {
  if (featuresCache) return featuresCache;
  const response = await fetch(ML_CONFIG.FEATURES_PATH);
  featuresCache = await response.json();
  return featuresCache!;
}

async function ensureSessions(): Promise<void> {
  const [rf, xgb] = await Promise.all([
    rfSession ?? loadModel(ML_CONFIG.RF_MODEL_PATH),
    xgbSession ?? loadModel(ML_CONFIG.XGB_MODEL_PATH),
  ]);
  rfSession = rf;
  xgbSession = xgb;
}

async function runModel(
  session: ort.InferenceSession,
  features: number[][],
  inputName: string
): Promise<number[]> {
  const flat = new Float32Array(features.length * features[0].length);
  for (let i = 0; i < features.length; i++) {
    for (let j = 0; j < features[i].length; j++) {
      flat[i * features[i].length + j] = features[i][j];
    }
  }

  const inputTensor = new ort.Tensor('float32', flat, [
    features.length,
    features[0].length,
  ]);

  const results = await session.run({ [inputName]: inputTensor });
  
  // Find the probabilities output. Usually it's the second output or named 'probabilities'
  const outputKey = session.outputNames.find(name => name.toLowerCase().includes('prob')) || session.outputNames[1] || session.outputNames[0];
  const probOutput = results[outputKey];
  
  if (!probOutput) {
    throw new Error(`Could not find probability output in model. Available: ${session.outputNames.join(', ')}`);
  }

  const data = probOutput.data as Float32Array;
  const probabilities: number[] = [];
  
  // Handing different output shapes (flat vs [N, 2])
  if (data.length === features.length * 2) {
    for (let i = 0; i < features.length; i++) {
      probabilities.push(data[i * 2 + 1]);
    }
  } else {
    for (let i = 0; i < features.length; i++) {
      probabilities.push(data[i]);
    }
  }

  return probabilities;
}

// Simple dream dictionary for the 'Dream Analyzer' feature
export const DREAM_DICTIONARY: Record<string, number[]> = {
  '꿈': [1, 10, 20],
  '돼지': [8, 12, 45],
  '조상': [1, 3, 5],
  '불': [7, 14, 21],
  '물': [2, 11, 22],
  '돈': [10, 25, 40],
  '똥': [15, 30, 45],
  '뱀': [4, 13, 31],
  '용': [5, 14, 23],
  '호랑이': [3, 12, 21],
  '죽음': [4, 44],
  '보석': [10, 11, 12],
  '하늘': [6, 16, 26],
  '바다': [2, 12, 22, 32, 42]
};

export function analyzeDream(text: string): number[] {
  if (!text) return [];
  const numbers: number[] = [];
  Object.keys(DREAM_DICTIONARY).forEach(keyword => {
    if (text.includes(keyword)) {
      numbers.push(...DREAM_DICTIONARY[keyword]);
    }
  });
  return [...new Set(numbers)];
}

export async function predictNumbers(strategy: RecommendStrategy = 'balanced', dreamText: string = ''): Promise<PredictionResult> {
  await ensureSessions();
  const features = await loadFeatures();

  const rfInputName = features.model_metadata.rf.input_name;
  const xgbInputName = features.model_metadata.xgb.input_name;

  const [rfProbs, xgbProbs] = await Promise.all([
    runModel(rfSession!, features.features, rfInputName),
    runModel(xgbSession!, features.features, xgbInputName),
  ]);

  const { rf: wRf, xgb: wXgb } = ML_CONFIG.ENSEMBLE_WEIGHTS;
  const ensembledProbs = rfProbs.map((p, i) => wRf * p + wXgb * xgbProbs[i]);

  const indexed = ensembledProbs.map((prob, idx) => ({
    number: idx + 1,
    probability: prob,
  }));
  indexed.sort((a, b) => b.probability - a.probability);

  // Mix in dream numbers if any
  const dreamNumbers = analyzeDream(dreamText);
  
  // Strategy-based picking logic
  let numbers: number[] = [];
  
  if (strategy === 'stable') {
    // Stable: Pick from top 10 most probable numbers
    const pool = indexed.slice(0, 10).map(x => x.number);
    while (numbers.length < 6) {
      if (pool.length === 0) break;
      const idx = Math.floor(Math.random() * pool.length);
      const num = pool.splice(idx, 1)[0];
      if (!numbers.includes(num)) numbers.push(num);
    }
  } else if (strategy === 'challenge') {
    // Challenge: Pick 2 from top, 2 from cold, 2 from mid-range
    // Find cold numbers first
    const hotNumbers: number[] = [];
    const coldNumbers: number[] = [];
    features.features.forEach((row, idx) => {
      if (row[5] >= 0.9) hotNumbers.push(idx + 1);
      if (row[6] >= 0.9) coldNumbers.push(idx + 1);
    });

    const poolTop = indexed.slice(0, 8).map(x => x.number);
    const poolCold = coldNumbers.length > 0 ? [...coldNumbers] : indexed.slice(30, 45).map(x => x.number);
    const poolMid = indexed.slice(15, 30).map(x => x.number);

    // Pick 2 from each
    const pick = (p: number[], count: number) => {
      for(let i=0; i<count; i++) {
        if (p.length === 0) break;
        const idx = Math.floor(Math.random() * p.length);
        numbers.push(p.splice(idx, 1)[0]);
      }
    };
    pick(poolTop, 2);
    pick(poolCold, 2);
    pick(poolMid, 2);
  } else {
    // Balanced (Default): Current weighted random-ish logic
    const pool = indexed.slice(0, 15).map(x => x.number);
    
    // If dream numbers exist, force include 1 or 2
    if (dreamNumbers.length > 0) {
      const dPickCount = Math.min(2, dreamNumbers.length);
      const dPool = [...dreamNumbers];
      for(let i=0; i<dPickCount; i++) {
        const idx = Math.floor(Math.random() * dPool.length);
        const num = dPool.splice(idx, 1)[0];
        if (!numbers.includes(num)) numbers.push(num);
      }
    }

    while (numbers.length < 6) {
      if (pool.length === 0) break;
      const idx = Math.floor(Math.random() * pool.length);
      const num = pool.splice(idx, 1)[0];
      if (!numbers.includes(num)) numbers.push(num);
    }
  }

  // Ensure uniqueness and sorted
  numbers = [...new Set(numbers)].slice(0, 6).sort((a, b) => a - b);
  if (numbers.length < 6) {
    // Fallback if something went wrong with strategy pools
    const allPool = Array.from({length: 45}, (_, i) => i + 1);
    while(numbers.length < 6) {
      const num = allPool[Math.floor(Math.random() * 45)];
      if (!numbers.includes(num)) numbers.push(num);
    }
  }

  // Extract hot/cold status for report features
  const hotNumbers: number[] = [];
  const coldNumbers: number[] = [];
  if (features && features.features) {
    features.features.forEach((row, idx) => {
      if (row[5] >= 0.9) hotNumbers.push(idx + 1);
      if (row[6] >= 0.9) coldNumbers.push(idx + 1);
    });
  }

  return {
    numbers: numbers.sort((a, b) => a - b),
    probabilities: ensembledProbs,
    rfProbabilities: rfProbs,
    xgbProbabilities: xgbProbs,
    hotNumbers,
    coldNumbers,
    strategy,
    drawNo: features.next_draw_no
  };
}
