This project is used to transfer the patient vital data such as heart rate, live video transmission and live feedback of the patient from the community worker side to hospital side using low bandwith using webRTC platform. 
This Project is developed in Node.js framework (more details can be found in package.json)
Since, this project uses Postgresql as db, make sure you have created an 'auth-system' db before you run the project.

It uses a client CLI python app written in Python 3.x for the patient heart rate data simulation.

Community Health Worker can simply run/open the portal by typing: "python vtclient.py" (located inside the support folder)

