declare module 'onnxruntime-web' {
  interface Env {
    wasm: {
      numThreads: number;
      wasmPaths?: string;
    };
  }

  export const env: Env;

  type DataType = 'float32' | 'int32' | 'int64' | 'string';

  export class Tensor {
    constructor(type: DataType, data: Float32Array | Int32Array, dims: number[]);
    readonly data: Float32Array | Int32Array;
    readonly dims: readonly number[];
  }

  interface SessionOptions {
    executionProviders?: string[];
  }

  interface RunResult {
    [key: string]: Tensor;
  }

  interface ModelMetadata {
    [key: string]: string;
  }

  interface ValueMetadata {
    [key: string]: string;
  }

  export class InferenceSession {
    static create(
      model: Uint8Array | string,
      options?: SessionOptions
    ): Promise<InferenceSession>;
    run(feeds: Record<string, Tensor>): Promise<RunResult>;
    readonly inputNames: readonly string[];
    readonly outputNames: readonly string[];
  }
}
