from __future__ import print_function
from neuron import h
import threading
import time
import datetime
import GeppettoLibrary as G

def process_events() :
    #h.doEvents()
    #h.doNotify()

    for key,value in G.sync_values.items():
        value.sync_value = str(eval("h."+key))

class LoopTimer(threading.Thread) :
    """
    a Timer that calls f every interval
    """
    def __init__(self, interval, fun) :
        """
        @param interval: time in seconds between call to fun()
        @param fun: the function to call on timer update
        """
        self.started = False
        self.interval = interval
        self.fun = fun
        threading.Thread.__init__(self)
        self.setDaemon(True)

    def run(self) :
        h.nrniv_bind_thread(threading.current_thread().ident);
        self.started = True;
        while True:
            self.fun()
            time.sleep(self.interval)

timer = LoopTimer(0.1, process_events)
timer.start()
while not timer.started:
    time.sleep(0.001)