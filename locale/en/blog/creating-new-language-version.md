# How to create a new language version of Pronouns.page

So you're interested in helping us extend the platform to your native language? Awesome! 🥰

But how do I do that, you ask?

First, please contact us at [contact@pronouns.page](mailto:contact@pronouns.page) (or another way).
Maybe someone already started working on that language? Maybe we have some useful tips?
It would be useful to coordinate before you put work into it. 

If you know how to work with tools like Git, Yarn, JavaScript etc.,
you can head to [the source code](https://gitlab.com/Avris/Zaimki/),
clone the repository and set up the project according to the instruction in README.md.
You'll be able to see the changes in real time as you make them.
Push them to a separate branch and submit a pull request.

Otherwise, don't worry. You can still help localise the project without knowing how to code.
Click [here](https://gitlab.com/Avris/Zaimki/-/archive/main/Zaimki-main.zip) to download a zip file with the code.
Don't mind everything else, just create a copy of the `/locale/en` directory,
calling the copy according to the new language code.
Instead of `en` (English) you can use a different language as a base,
if you think it's gonna be easier – 
eg. for translating into Slavic languages it might be better to start with `pl` (Polish).

Inside that directory hides all the config and code related to the specific language.
The most important files are:

## translation.suml

This file contains translation keys with corresponding values.
Basically, keep everything before the colon as it is, and translate everything after the colon into your language.

Or rather “localise” it, not translate. Every language is unique, so remember to _adjust_
the content to whatever makes more sense, not just say the same thing just in another language.

Also, remember that not everything in this file will necessarily require a translation from you.
For instance, the Polish locale contains translations for the “names” module,
which a new language will probably not have right away (although might be added later).

## config.suml

Although this file is very important, I don't expect you to handle it, if you're not a technical person.
Still, some translations are also included there, so please go through it and see if you can do something useful there.
The format should be pretty intuitive.

This file contains for example a definition of [links](/link), [authors](/contact) etc.
You can either adjust those definitions directly in this file if you can,
or you can just put them in some Word or Excel file for me to handle.

## pronouns/pronouns.tsv

This file is a table of pronouns. You can edit it in Excel or just a text editor (just keep the tabs where they were).
Columns from `pronoun_subject` to `reflexive` can be removed and replaced with other forms relevant to your language.

## pronouns/pronouns.tsv

This table contains the groups of pronouns.

## pronouns/examples.tsv

This table contains the example sentences – with placeholders for the pronouns to be inserted into.
If plural sentence is the same as singular you can leave the second column empty.

## And more…

The steps above are the bare minimum to get things started. Once you're done with them,
please send zip the entire directory (and whatever other materials you'd like to share)
and send the zip to [contact@pronouns.page](mailto:contact@pronouns.page) (or submit a pull request).

With those files we'll be able to put your version on a test server so that you (and we) can see the result
and discuss where to go further.
Once it's on the server you'll also be able to submit sources from literature, dictionary entries, etc.

Thank you for contributing! 🥰
