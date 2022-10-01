# Missing custom flags

<small>2022-10-01 | [@andrea](/@andrea)</small>

I've recently done a big restructuring of database schema in order to be able to start adding new features to the cards.
More info in the blog post: [Release Notes: Public API profiles v2](/blog/release-notes-profile-v2).
I had tested it quite thoroughly and rolling it out went pretty smoothly. Except, there was one thing I forgot about 😢

There's two main places we store the data: a database on our server
and an S3 bucket in the cloud that stores extra files (like images). 
When somebody removes something from the page, it is immediately removed from the database,
but the underlying images in the cloud might still remain – albeit without any connection to the person or their card anymore.
That's why we have a script that runs twice a month and removes all the unused files
– both for extra privacy, and to optimise the storage cost.

Unfortunately, it completely skipped my mind that this script would be affected by the v2 restructuring 😢
It removes unused files, but the definition of “used” has changed in v2.
Basically, it saw all the flags as unused, because they didn't match the new schema, and removed them 🤦‍

We make nightly backups of our database and server configuration – but the cloud is a separate story 😢
We store a lot of data there (over a million objects, around 46 GB) so keeping copies of everything would be over our budget. 
Luckily, with the introduction of ads we'll now be able to afford it.
Unfortunately, I didn't enable those backups early enough. As far as I know, at this point there's no way to restore the images 😭

**I'm terribly sorry for that.** I should have been more careful about the recent changes.
The system got so complex over time that it's hard to keep track of everything –
and it's very hard to test and find issues, if they turn out to happen in an asynchronous, detached, biweekly script. 

## What should you do now, if you're affected?

 - Well, the good news is that the _data_ is still there, it's just the _image_ that's missing.
   If you go to [the card editor](/editor) you'll still see _what_ your custom flags were,
   you'll just need to re-upload the image that it was connected to.
   I know it will be quite tedious for some of you (there are cards with 50 flags or so!),
   but it's a one-time action.
 - Please be understanding 😅

## What did I do / will I do to mitigate the issue and avoid similar issues in the future?

 - I enabled bucket versioning on S3 – we'll now have backups of everything.
 - I still need to set up lifecycle rules so that those backups get removed eventually, but giving us enough time to restore data if we ever lose any again. 
 - I've disabled the cleanup script until I'm sure it's fixed and more resilient.
 - I'll fix the script itself.
 - I'll add checks to that script so that if an unusual number of files is set to be removed, it will stop and notify me of the anomaly.
 - I wrote this blog post to explain the issue.
 - If a file cannot be loaded on one's card, instead of showing the text twice, it will now show an <span class="fal fa-exclamation-circle text-danger"></span> icon
   that links to this blog post – so that users know what happened and how to fix it.

Again, I apologise for the trouble! 😢 Turns out, even trying to _add_ some new cool features
can inadvertently result in _losing_ something. Lesson learned…
