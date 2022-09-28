# Privacy issue disclosure (mitigated)

<small>2022-09-28 | [@andrea](/@andrea)</small>

Users' cards are public – that's the whole point of them. But it's its owner's choice not only what exactly to put in their card,
but also whom and how to send a link to it. Links to the cards are _not secret_, and they're obviously meant to be _shared_ –
but we've decided not to _list_ them anywhere on our site (other than internally in the admin panel)
and to ask crawlers via the [robots.txt](/robots.txt) file not to index those subpages.

Recently, when we moved our traffic analytics from [Matomo](https://matomo.org/) to [Plausible](https://plausible.io/),
I decided to take advantage of its feature to publish [the traffic overview page](https://stats.pronouns.page/en.pronouns.page?period=30d).
It's meant to increase transparency (you can check for yourself what data we store – that they're anonymised and high-level),
to support a cool open-source project by showing what tools we use,
and to brag a bit and show what kinds of traffic is the server dealing with.

Unfortunately, what I didn't notice is that in the “top pages” section it would also show some card links,
if they were visited often enough. Big kudos to [@tecc](/@tecc), who not only noticed it,
but also implemented a solution and retroactively redacted that information in Plausible's database.
Now every request to `/@anything…` will be counted as `/@--redacted--`.

Note: this does _not_ mean any _private_ data or _passwords_ were leaked
(we store just a minimal set of data anyway, and [we don't even store passwords](https://avris.it/blog/passwords-are-pass%C3%A9)).
It's just about listing public some data that we didn't intend to list.

We doubt whether this issue had actually been abused for any nefarious purposes, but we thought we'd let you know just in case.
Of course, by their very nature, links to various cards have always been present all around the web, as they're meant to be shared
– and once the owner of a card shares their link with _anyone_, that person can just pass it on.
And of course one can always find some valid cards by simply guessing usernames.
But for the sake of people who prefer keeping their links more private, we had decided not to list the usernames anywhere.
This instance of publishing a limited list of some usernames was not intentional, and we apologise.
If keeping usernames unlisted is important to you, we recommend simply [changing your username](/account).
