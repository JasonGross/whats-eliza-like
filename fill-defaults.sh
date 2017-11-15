#!/bin/bash

cat "$1" \
    | sed s"/\(\s*\)@default@/\1\"What's that like?\",\n\1\"What's that like for you?\"/g" \
    | sed s"/\(\s*\)@default2@/\1\"(2).  What's that like?\",\n\1\"(2).  What's that like for you?\"/g" \
    | sed s"/\(\s*\)@default2-mid@/\1\"What's (2) like for you?\",\n\1\"What's (2) like, for you?\"/g" \
    | sed s"/\(\s*\)@default3@/\1\"(3).  What's that like?\",\n\1\"(3).  What's that like for you?\"/g" \
    | sed s"/\(\s*\)@default3-mid@/\1\"What's (3) like for you?\",\n\1\"What's (3) like, for you?\"/g" \
    | sed s"/\(\s*\)@default4@/\1\"(4).  What's that like?\",\n\1\"(4).  What's that like for you?\"/g" \
    | sed s"/\(\s*\)@default4-mid@/\1\"What's (4) like for you?\",\n\1\"What's (4) like, for you?\"/g" \
    > "$2"
