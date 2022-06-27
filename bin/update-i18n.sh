#!/bin/bash

bin/xliff-to-json/xliff-to-json src/locale/
mv src/locale/*.json src/assets/i18n/
