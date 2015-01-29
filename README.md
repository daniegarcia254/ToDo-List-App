# Web Engineering 2014-2015
This is the repository that we will use for  uploading all the assignments for course 2014-2015.

## Theory

Source code:
* [Representation and formats](formats)
* [Anatomy of a simple dynamic Web application](servlets)
* ["Big" web services](bigws)
* [REST web services](rest)

## Lab
* [0 - Setup](labs/setup.md)
* [1 - RPC/SOAP](labs/soap.md)
* [2 - REST](labs/rest.md)
* [3 - Events](labs/events.md)
* [4 - EIP](labs/eip.md)

## Set up git
This is a __git__ repository. First, you’ll need to sign up for an account on [GitHub.com](https://github.com). Install __git__ for Windows, Mac or Linux as [needed](http://git-scm.com/downloads). 
Next, in your console type:
```
$ git config --global user.name "Your Name Here"
$ git config --global user.email "your_email@youremail.com"
$ git config --global push.default simple
```
Next steps you must configure your preferred way to connecting __GitHub__: __HTTPS__ ([tutorial](https://help.github.com/articles/caching-your-github-password-in-git)) or __SSH__ ([tutorial](https://help.github.com/articles/generating-ssh-keys)).
Now you can create your own online repository on __GitHub__ ([tutorial](https://help.github.com/articles/create-a-repo))
## Fork this repository
Forking this repository is very easy. First click on the right-top corner of the page __Fork__. That's it!
Next you need to keep your fork synced. We assume here that you have set up __git__ in your computer.
```
$ git clone https://github.com/YOUR-GITHUB-USERNAME/WebEng2014
$ cd WebEng2014
$ git remote add upstream https://github.com/UNIZAR-30246-WebEngineering/WebEng2014.git
```
## Keep synced this repository
Do the following steps to keep your repo synced.
```
$ cd WebEng2014
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```
## Upload your changes
First add your changes into your local repository:
```
$ cd WebEng2014
$ git add -A
$ git commit -m "A CONSISE DESCRIPTION"
```
And then push them to your online _WebEng2014_ repository in __GitHub__:
```
$ git push
```
Finally, you must make a pull request. Go to your _WebEng2014_ repository in __GitHub__ and click on the green icon on the left. Create a pull request so that we can check your changes and accept them in this repository. If everything is ok, your changes will be added. If not, you will receive a message explaining why not.
