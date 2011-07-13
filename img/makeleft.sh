#!/bin/bash

for i in `seq 1 3`; do convert character-walk-right-$i.png -flop character-walk-left-$i.png; done
