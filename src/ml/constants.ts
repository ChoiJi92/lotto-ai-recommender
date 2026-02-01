export const ML_CONFIG = {
  RF_MODEL_PATH: '/models/rf_model.onnx',
  XGB_MODEL_PATH: '/models/xgb_model.onnx',
  FEATURES_PATH: '/models/next_draw_features.json',
  NUM_NUMBERS: 45,
  PICK_COUNT: 6,
  ENSEMBLE_WEIGHTS: { rf: 0.5, xgb: 0.5 },
} as const;
