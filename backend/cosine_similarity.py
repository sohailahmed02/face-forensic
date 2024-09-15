import numpy as np

def cosine_similarity(embedding1, embedding2):
  """Calculates the cosine similarity between two embeddings.

  Args:
    embedding1: A numpy array representing the first embedding.
    embedding2: A numpy array representing the second embedding.

  Returns:
    The cosine similarity between the two embeddings.
  """

  dot_product = np.dot(embedding1, embedding2)
  magnitude1 = np.linalg.norm(embedding1)
  magnitude2 = np.linalg.norm(embedding2)
  cosine_similarity = dot_product / (magnitude1 * magnitude2)
  return cosine_similarity