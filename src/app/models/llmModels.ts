export interface InfoModel {
  model_name: string;
  dimensions: number;
  max_sequence_length: number;
  description: string[];
  use_case: string[];
  language: string;
}