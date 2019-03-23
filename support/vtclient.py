import serial.tools.list_ports
#import re
from selenium import webdriver

url = r'https://localhost:9000/'
driver=webdriver.Chrome(executable_path=r"F:\Study Meterial\SEM -VIII\SIH\code\vitaltransfer\chromedriver")
driver.get(url)



ports = list(serial.tools.list_ports.comports())
p = []
for p in ports:
    print(p)
    if "Arduino" in p[1]:
        print("This is an Arduino!")
        print(p[0])

port = p[0]
serialport = serial.Serial(port, 9600, timeout=2)

'''
def only_numerics(seq):
    seq_type= type(seq)
    return seq_type().join(filter(seq_type.isdigit, seq))
'''

ans = input("Enter any letter.")

while True:

    #data = serialport.readline().decode('utf-8').strip('\n').strip('\r').strip('\0')
    data = serialport.readline().decode('utf-8').strip()

    #data = data.rstrip('\r\n')
    #data = data.rstrip('\n')
    #data = data.strip()
    #data = int(data)
    #int(data)
    #data = try_parse_int(data)
    #data = int(data)
    #data = re.sub("[^0-9]", "", data)

    #data = only_numerics(data)
    #int(data)
    '''
    for line in :
        if line.strip():           # line contains eol character(s)
            n = int(line)
    '''
    #driver.find_element_by_id('dataChannelSend').send_keys(data)
    driver.execute_script("document.getElementById('dataChannelSend').value = " + data + ";")
    #driver.execute_script("sendMessage();")

    #print(data)


    