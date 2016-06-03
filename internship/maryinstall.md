#Installing and using MaryTTS

####All (minimum) requirements:
- Java 7
- Maven 3.0
- MaryTTS 5.1
- awk, perl, bc
- sox 13.0
- tcl supporting snack
- snack library for tcl
- HTS 2.2 (patch for HTK 3.4.1)
- SPTK 3.4.1
- HTK 3.4.1
- HTS Engine API 1.05
- GNU make
- Edinburgh Speech Tools
- Festival
- Festvox

#####Notes:
- Strongly suggested to use a Linux machine.
- Suggested to use the most recent version available of all the above programs.
- Festvox version 2.7 is missing a required file (`getwavlist.pl`), which can be found in version 2.1. Simply copying the file to the matching directory from the older version to the newer is sufficient.
- Festvox building relies on Festival being build, which itself requires the Edinburgh Speech Tools to be built. All of these are most reliably compiled with GNU make and gcc.
- From the root folder for MaryTTS, you can run `/lib/external/check_install_external_programs.sh` with the option `-check` or `-install`. These will test if all the requirements can be found (the second option will attempt to install them if not). You can also provide paths to the tools as additional arguments. A `/lib/external/externalBinaries.config` file will be generated to locate the tools.

##Step by step installation from scratch on Linux:
- Install git
```bash
$ sudo apt-get install -y git
```
- Clone the repository
```bash
$ git clone https://github.com/marytts/marytts.git
```
- Install Java JDK 7 and Maven
```bash
$ sudo apt-get install -y openjdk-7-jdk maven
```
- Compile MaryTTS (from the top-level folder)
```bash
$ cd marytts
$ mvn install
```
- Run the server (replace `<VERSION>` with the appropriate version number, which may be suffixed with `-SNAPSHOT` e.g. `marytts-5.2-SNAPSHOT`)
```bash
$ target/marytts-<VERSION>/bin/marytts-server
```
- Connect to the server, either from a web browser at `localhost:59125`, or as follows
```bash
$ target/marytts-<VERSION>/bin/marytts-client
```
- From here, test that the synthesiser is working using the interface provided
- Additional language/voice components can be installed
```bash
$ target/marytts-<VERSION>/bin/marytts-component-installer
```







####To use MaryTTS just for speech synthesis:
#####Latest binary release (at time of writing v5.1.2)
- Simply download the installer zip file from [here](https://github.com/marytts/marytts/releases)
- Note that this will not include the voice building tools

#####Latest source release (at time of writing v5.2-beta3)
- Make sure the [Maven 3.0 or higher](http://maven.apache.org/download.html) tool is installed
- Download the source code from [the release page](https://github.com/marytts/marytts/releases), or clone the repo
- In the top-level folder of the source code, run `mvn install`
- Once this compiles successfully, there should be a `target/marytts-<VERSION>/bin` folder, which contains the components to run MaryTTS

__In both cases__, to use the speech synthesiser, launch the `mary-server` component, then connect to it either with the `mary-client` component, or using `localhost:59125` in a web-browser.





