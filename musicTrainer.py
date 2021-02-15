# coding: utf8
from random import randrange
import os
import json
import time
from datetime import datetime

clear = lambda: os.system('clear')

INTERVALS = ['kleine Sekunde (1)', 'große Sekunde (2)', 'kleine Terz (3)', 'große Terz (4)', 'Quarte (5)', 'verminderte Quinte (6)', 'Quinte (7)', 'kleine Sexte (8)', 'große Sexte (9)', 'kleine Septime (10)', 'große Septime (11)', 'Oktave (12)']
NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

class Data():
    def __init__(self, date, exercise, totalRepetitions, score, timeNeeded):
        self.date = date
        self.exercise = exercise
        self.totalRepetitions = totalRepetitions
        self.score = score
        self.timeNeeded = timeNeeded

class JSONStorage():
    def __init__(self):
        self.data = []
    
    def loadFromFile(self, filename="store.json"):
        with open(filename) as json_file:
            self.data = json.load(json_file)
    
    def writeToFile(self, filename="store.json"):
        with open(filename, 'w') as outfile:
            json.dump(self.data, outfile)

    def addData(self, data):
        self.data.append(data.__dict__)

class Exercise():
    def __init__(self):
        pass
    
    def repeat(self):
        return self.exercise()
    
    def exercise(self):
        raise Exception("No Exercise defined!")
    
class ExerciseSet():
    def __init__(self, type, storage=JSONStorage()):
        self.storage = storage
        self.totalRepetitions = int(input("How many repetitions do you want to train? "))
        self.score = 0
        if type == "interval":
            self.exercise = IntervalExercise()
        else: 
            raise Exception("Exercise type unknown!")

    def run(self):
        self.startTime = time.time()
        for i in range(0, self.totalRepetitions):
            result = self.exercise.repeat()
            self.score += result
        self.endTime = time.time()

    def storeResult(self):
        data = Data(
            date=datetime.now().isoformat(),
            exercise=self.exercise.exerciseName,
            totalRepetitions=self.totalRepetitions,
            score=self.score,
            timeNeeded=round(self.endTime-self.startTime)
        )
        self.storage.addData(data)
        self.storage.writeToFile()

class IntervalExercise(Exercise):
    
    def __init__(self):
        self.intervals = INTERVALS
        self.notes = NOTES
        self.setUp()
        self.exerciseName = "Interval Exercise"

    def setUp(self):
        self.mode = int(input("""
            Modus: 
            0 - random
            1 - kleine Sekunde (1)
            2 - große Sekunde (2)
            3 - kleine Terz (3)
            4 - große Terz (4)
            5 - Quarte (5)
            6 - verminderte Quinte (6)
            7 - Quinte (7)
            8 - kleine Sexte (8)
            9 - große Sexte (9)
            10 - kleine Septime (10)
            11 - große Septime (11)
            12 - Oktave (12)
            """))
        if self.mode < 0 or self.mode > 12:
            raise Exception("Invalid Input!")
        else: 
            clear()

    def exercise(self):
        number = randrange(12)
        note = self.notes[number]
        interval = self.intervals[self.mode-1]
        answer = input((f"Please gimme the {interval} from {note} ({self.mode})=>"))
        if answer == self.notes[(number + self.mode) % 12]:
            print("Correct!")
            time.sleep(1)
            clear()
            return 1
        else:
            print("Wrong! Correct answer is: ", self.notes[(number + self.mode) % 12])
            time.sleep(1)
            clear()
            return 0




exerciseSet = ExerciseSet(type="interval")
exerciseSet.run()
exerciseSet.storeResult()