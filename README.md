# Valencia_UPV
Repository for Valencia_UPV team code for the 2017 igem competition

PlantLabCo raises to todays Plant SynBio researchers problems. This multifunctional
website contains a repository that unifies all experimentsâ€™ results increasing current
scientific work. Furthermore, software modeling tool is integrated to ease
the mathematical modelsâ€™ generation of genetic circuits. All guided by a
developed metadataâ€™s standard accepted and reviewed by professors and researchers, unifying
registered information and allowing data mining.

#Demo
[Demo here](http://plantlabco.org)


#Installation Guide

This piece of software has been developed using MEAN full-stack, in order to deploy
it is necessary to have installed this framework

We recommend going though the following steps from Ubuntu 16.4, for a proper deployment to be guaranteed

$ sudo apt-get install git
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ service mongod status
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo apt-get install build-essential
$ sudo npm install -g bower
$ sudo npm install -g gulp
$ sudo npm install -g mean-cli


Then we enter the folder and execute the following instruction

$ node server


-----------------------------------------------------------------------------------------

Copyright 2017 Juan Pasogias Guallart

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
