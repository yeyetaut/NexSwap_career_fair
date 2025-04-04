#!/usr/bin/env python
# coding: utf-8

# In[3]:

from __future__ import print_function 
import tkinter as tk
from tkinter import scrolledtext, ttk
import serial
import serial.tools.list_ports
import threading
import time
import sys
import pickle 
import os.path 
import io 
import shutil 
import requests 
from mimetypes import MimeTypes 
import asyncio
import websockets
import json

#global resume

filename = "resume.json"

if not os.path.exists(filename):
    with open(filename, "w") as f:
        json.dump([], f)

with open(filename, "r") as f:
    resume = json.load(f)



# WebSocket Server Logic
#async def hello(websocket,resume):
#    name = await websocket.recv()
#    print(f'Server Received: {name}')
#    greeting = f'Hello {name}'
#    await websocket.send(greeting)
#    print(f'Server sent: {greeting}')

#async def websocket_server():
#    async with websockets.serve(hello, "localhost", 8765):
#        print("WebSocket server started")
#        await asyncio.Future()  # Run forever

# Thread management
#def run_websocket_server():
#    asyncio.run(websocket_server())

# Start WebSocket server in a separate thread
#websocket_thread = threading.Thread(target=run_websocket_server, daemon=True)
# websocket_thread.start()

# Tkinter GUI components

# Function to scan available COM ports
def scan_ports():
    ports = serial.tools.list_ports.comports()
    return [port.device for port in ports]

# Function to refresh COM ports in dropdown
def refresh_ports():
    ports = scan_ports()
    port_combobox['values'] = ports
    if ports:
        port_combobox.set(ports[0])  # Set the first port as default

# Function to connect to the selected COM port
def connect_to_esp32():
    try:
        global ser
        selected_port = port_combobox.get()
        ser = serial.Serial(port=selected_port, baudrate=115200, timeout=1)
        log_message(f"Connected to ESP32 on {selected_port}")
        # Start the serial reading thread
        threading.Thread(target=read_serial, daemon=True).start()
    except Exception as e:
        log_message(f"Error connecting to ESP32: {e}")

# Function to ping ESP32
def ping_esp32():
    try:
        ser.write(b"PING\n")
        response = ser.readline().decode().strip()
        if response == "PONG":
            log_message("ESP32 is online!")
        else:
            log_message("No response from ESP32.")
    except Exception as e:
        log_message(f"Error pinging ESP32: {e}")

# Function to read serial data
def read_serial():
    while True:
        try:
            if ser.in_waiting > 0:
                data = ser.readline().decode().strip()
                print(data)
                with open(filename, "r") as f:
                    resume = json.load(f)
                log_message(f"Received: {data}")
                if(data[0:5] == "https"):
                    new_entry = {"resume": data[8:]}
                    if new_entry not in resume:
                        resume.append(new_entry)
                        with open(filename, "w") as f:
                            json.dump(resume, f, indent=2)
                # Process data for NFC
                if data.startswith("NFC:"):
                    global nfc_data
                    nfc_data = data.split("NFC:")[1]
                    log_message(f"NFC Data: {nfc_data}")
        except Exception as e:
            log_message(f"Error reading serial: {e}")
        time.sleep(0.1)

# Function to log messages in the GUI
def log_message(message):
    serial_monitor.configure(state="normal")
    serial_monitor.insert(tk.END, message + "\n")
    serial_monitor.configure(state="disabled")
    serial_monitor.see(tk.END)

# GUI Setup
root = tk.Tk()
root.title("ESP32 NFC Reader")

# Serial Port Configuration
port_label = tk.Label(root, text="Select Serial Port:")
port_label.pack(pady=5)

port_combobox = ttk.Combobox(root, state="readonly")
port_combobox.pack(pady=5)
refresh_ports()

refresh_button = tk.Button(root, text="Refresh Ports", command=refresh_ports)
refresh_button.pack(pady=5)

connect_button = tk.Button(root, text="Connect", command=connect_to_esp32)
connect_button.pack(pady=5)

# Ping ESP32 Button
ping_button = tk.Button(root, text="Ping ESP32", command=ping_esp32)
ping_button.pack(pady=5)

# Serial Monitor
serial_monitor_label = tk.Label(root, text="Serial Monitor:")
serial_monitor_label.pack(pady=5)
serial_monitor = scrolledtext.ScrolledText(root, width=50, height=20, state="disabled")
serial_monitor.pack(pady=5)

status_label = tk.Label(root, text="WebSocket Server Running")
status_label.pack(pady=20)

# Start the GUI event loop
root.mainloop()

# import the required libraries 