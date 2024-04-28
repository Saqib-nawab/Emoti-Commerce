from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

#chatbot imports
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from torch.utils.data import Dataset, DataLoader
from tqdm import tqdm
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import math,json, random

app = Flask(__name__)
CORS(app, resources={r"/analyze_sentiment": {"origins": "http://localhost:3001"}})
CORS(app, resources={r"/chatbot": {"origins": "http://localhost:3001"}})
CORS(app, resources={r"/callbot": {"origins": "http://localhost:3001"}})

def analyze_sentiment(comment):
    classifier = pipeline("text-classification", model='bhadresh-savani/distilbert-base-uncased-emotion', return_all_scores=False)
    prediction = classifier(comment)
    return prediction[0]['label']  # Extracting the sentiment label from the prediction

def detail_analyze_sentiment(comment):
    classifier = pipeline("text-classification", model='bhadresh-savani/distilbert-base-uncased-emotion', return_all_scores=True)
    prediction = classifier(comment)
    return prediction

@app.route('/analyze_sentiment', methods=['POST']) #exposing this method using flask app
def analyze_sentiment_route():
    data = request.json
    comment = data.get('comment')
    if comment:
        sentiment = analyze_sentiment(comment)
        detail_sentiment = detail_analyze_sentiment(comment)
        return jsonify({'sentiment': sentiment, 'detail_sentiment': detail_sentiment}), 200
    else:
        return jsonify({'error': 'Comment not provided'}), 400
    

device = "cuda" if torch.cuda.is_available() else "cpu"

with open("prompts.json") as f:
  data = json.load(f)

tags = []
prompts = []
responses = []

for i in data['intents']:
  tags.append(i['tag'])

  for j in i['questions']:
    prompt = j.lower()
    prompt = prompt.strip("?.")
    prompts.append((prompt, i['tag']))

labelsToid = {label:id for id,label in enumerate(tags)}
idTolabels = {id:label for id,label in enumerate(tags)}
idTolabels
labelsToid

model_name = "bert-base-uncased"
max_len = 256

tokenizer = BertTokenizer.from_pretrained(model_name,
                                          max_length=max_len)

model = BertForSequenceClassification.from_pretrained(model_name,
                                                      num_labels=len(tags)
                                                      )

model = model.to(device)
model

#Creating Dataset
class Dataset(Dataset):
  def __init__(self, prompts, labels):
    self.prompt = prompts
    self.label = labels

  def __len__(self):
    return len(self.prompt)

  def __getitem__(self, index):

    # Getting prompts
    prompt = self.prompt[index]

    # Extracting label id from prompt
    label_id = self.label[prompt[1]]

    # Converting to tensor
    label_id = torch.tensor(label_id)

    # Returning the prompt and it's respective label id
    return prompt[0], label_id

dataset = Dataset(prompts, labelsToid)

trainset, testset = train_test_split(dataset, test_size=0.25, random_state=40)

batchSize = 32

trainLoader = DataLoader(
    trainset,
    batch_size = batchSize,
    shuffle = True,
)

valLoader = DataLoader(
    testset,
    batch_size = batchSize,
    shuffle = False
)

optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)

#Defining Training & Testing Function
def train_or_val(model, optimizer, dataloader, train):

  if train:
    model.train()
  else:
    model.eval()

  running_loss = 0
  correct = 0
  pre, rec, f1 = 0,0,0
  all_labels = []
  all_preds = []

  for prompt, labels in dataloader:

    # Passing Inputs to Tokenizer
    input = tokenizer(prompt, return_tensors='pt', truncation=True, padding=True)
    # Passing them on CUDA or CPU depending on the availability
    input = input.to(device)
    labels = labels.to(device)
    # Forward Pass
    yhat = model(**input, labels = labels)
    # Getting Predictions
    pred = yhat['logits'].argmax(1)
    # Computing loss
    loss = yhat.loss
    running_loss += loss.item()

    # Backpropogation
    if train:
      optimizer.zero_grad() # Making gradient equal to zero to avoid accumulation
      loss.backward() # Calculating Gradients
      optimizer.step() # Updating weights and biases

    else:
      # Computing Accuracy
      correct += (pred == labels).sum()

      # Computing Precision, Recall, and F1 score
      p, r, f, _ = precision_recall_fscore_support(labels.cpu().numpy(), pred.cpu().numpy(), average='macro', zero_division=1)
      pre += p
      rec += r
      f1 += f

      # Append true labels and predictions
      all_labels.extend(labels.cpu().numpy())
      all_preds.extend(pred.cpu().numpy())

  # Calculating Loss
  loss = running_loss/len(dataloader)

  if train:
    return loss

  else:
    # Calculating Accuracy
    accuracy = correct/len(dataloader.dataset) * 100

    # Calculating Precision, Recall, F1 Score
    precision = pre/len(dataloader) * 100
    recall = rec/len(dataloader) * 100
    f1 = f1/len(dataloader) * 100

    return loss, accuracy, precision, recall, f1, all_labels, all_preds

model_path = "chatbot.pth"  
model.load_state_dict(torch.load(model_path, map_location=torch.device(device)))


def chatbot(prompt):

  # Passing Inputs to Tokenizer
  input = tokenizer(prompt, return_tensors='pt', truncation=True, padding=True)

  # Passing them on CUDA or CPU depending on the availability
  input = input.to(device)
  # Forward Pass
  yhat = model(**input)
  # Getting label id
  pred = yhat['logits'].argmax(1)
  # Getting label
  label = idTolabels[pred.item()]
  # Getting responses
  response = random.choice(data['intents'][pred.item()]['responses'])
  return label, response

@app.route('/chatbot', methods=['POST'])
def chat_endpoint():
    print("Received POST request to /chatbot")
    data = request.get_json()
    user_input = data["prompt"].strip("?.").lower()
    label, response = chatbot(user_input)
    return jsonify({"label": label, "response": response})

 

if __name__ == '__main__':
    app.debug=True
    app.run( host='0.0.0.0', port=3000)

