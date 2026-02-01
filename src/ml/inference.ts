import * as ort from 'onnxruntime-web';
import type { NextDrawFeatures, PredictionResult } from './types';
import { ML_CONFIG } from './constants';

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

  // Output 'probabilities' has shape [N, 2] where column 1 is P(drawn)
  const probOutput = results[session.outputNames[1]];
  const data = probOutput.data as Float32Array;
  const probabilities: number[] = [];
  for (let i = 0; i < features.length; i++) {
    probabilities.push(data[i * 2 + 1]);
  }

  return probabilities;
}

export async function predictNumbers(): Promise<PredictionResult> {
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
  const numbers = indexed
    .slice(0, ML_CONFIG.PICK_COUNT)
    .map((x) => x.number)
    .sort((a, b) => a - b);

  return {
    numbers,
    probabilities: ensembledProbs,
    rfProbabilities: rfProbs,
    xgbProbabilities: xgbProbs,
  };
}
