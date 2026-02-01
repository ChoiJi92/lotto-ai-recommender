export interface NextDrawFeatures {
  next_draw_no: number;
  based_on_draws: number;
  computed_at: string;
  feature_names: string[];
  features: number[][]; // 45 rows x 17 columns
  model_metadata: {
    rf: { input_name: string; output_names: string[] };
    xgb: { input_name: string; output_names: string[] };
  };
}

export interface PredictionResult {
  numbers: number[];
  probabilities: number[];
  rfProbabilities: number[];
  xgbProbabilities: number[];
}
