from flask import Flask, request, abort
from flask_cors import CORS
import json
import re

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def webhook():
    print("webhook");
    if request.method == 'POST':
        #print(request.json)
        with open('out.json', 'w') as f:
            json.dump(request.json, f)
        return '', 200
    else:
        abort(400)


if __name__ == '__main__':
    app.run()
