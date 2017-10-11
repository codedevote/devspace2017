#!/bin/bash

dotnet build ./TodoApi

dotnet test ./TodoApi.UnitTests

dotnet publish --output ../artifacts --configuration Release ./TodoApi