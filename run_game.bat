@echo off
title Super Mario 2D
echo Uruchamianie gry Super Mario 2D...

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start py server.py
    exit
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start python server.py
    exit
)

start index.html
exit
