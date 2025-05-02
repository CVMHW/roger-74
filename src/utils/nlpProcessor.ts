import { AutoTokenizer, AutoModelForSequenceClassification } from '@huggingface/transformers';
import { Tensor } from 'onnxruntime-web'; // Optional if ONNX is used for inference

// Load the tokenizer and model
const tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased-finetuned-sst-2-english');
const model = AutoModelForSequenceClassification.from_pretrained('distilbert-base-uncased-finetuned-sst-2-english');

/**
 * Detects the emotion in a given text using DistilBERT.
 * @param input User's input text.
 * @returns The detected emotion label.
 */
export async function detectEmotion(input: string): Promise<string> {
  const encoded = tokenizer.encode(input, { return_tensors: 'pt' });
  const output = await model(encoded);
  const logits = output.logits;
  const probabilities = logits.softmax(1);
  const emotionIndex = probabilities.argmax().item();

  return model.config.id2label[emotionIndex]; // Returns emotion label (e.g., "positive", "negative")
}
