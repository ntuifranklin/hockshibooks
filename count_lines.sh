#!/bin/bash
LINES=0
for n in $( find . -name "*.js" | wc -l | cut -b-7); do
    ((LINES += n))
done
echo $LINES
