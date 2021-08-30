import time
import webhook_listener
import json

# arduino = serial.Serial(port='COM14', baudrate=115200, timeout=0)

def process_post_request(request, *args, **kwargs):
    req = (format(
            request.body.read(int(request.headers["Content-Length"]))
            if int(request.headers.get("Content-Length", 0)) > 0
            else ""
        ))
    if req[0] == "b":
        req = req[1:]
        pass
    req = (json.loads(eval(req)))
    print(req)
    # Process the request!
    # ...

    return


webhooks = webhook_listener.Listener(handlers={"POST": process_post_request})
webhooks.start()

while True:
    print("Still alive...")
    time.sleep(300)