#!/usr/bin/python

'''
This file will eventually take in the audio file from the front end,
send it to Transccriber for processing and return the output to the frontend.
Is there a chance you could say the right word but Transcriber doesn't
recognize the word? If so, probably need a seperate test and answer.
'''

import speech_recognition as sr
import sys
#
# print("0: "+sys.argv[0])
# print("1: "+sys.argv[1])
# print("2: "+sys.argv[2])
# print("3: "+sys.argv[3])
# sys.stdout.flush()

fe_great = 'Great job!'
fe_good = 'Good work'
fe_again = 'Please try again'
fe_bad = 'You suck'

points = 0

# initialzie recognizer
r = sr.Recognizer()
# read in audio file
#sound = AudioSegment.from_wav(sys.argv[1])
#sound.export(sys.argv[1], format="wav", parameters=["-ac", "1"])


transcribed = sr.AudioFile(sys.argv[1])
# essentially converting .wav to 'audio' object
with transcribed as source:
    audio = r.record(source)
# send to api
userGuess = r.recognize_google(audio)

wordClicked = sys.argv[2] #'horse'

print(userGuess)
sys.stdout.flush()


#First Try
if (sys.argv[3]) == True:
    if userGuess == wordClicked:
        print(fe_great)
        sys.stdout.flush()
        points += 3
    else:
        print(fe_again)
        sys.stdout.flush()


#Second Try
else:
    if userGuess == wordClicked:
        print(fe_good)
        sys.stdout.flush()
        points += 1
    else:
        print(fe_bad)
        sys.stdout.flush()
        if points >= 1:
            points -= 1
        else:
            pass

# if points >= 10:
#     print('You are a word wizard!')
#     sys.stdout.flush()

print("FINISHED")
sys.stdout.flush()
