# Financial transparency (2020-2021)

<small>2021-12-28 | [@andrea](/@andrea)</small>

Hi, everyone!

Since we ask y'all for donations and we finance our servers by using an [arc.io](https://arc.io) widget,
it's only fair that we regularly share updates on how much we get and what do we spend it on.

Unfortunately, the post will be a bit long and complex, because there's an important complication to our finances.
Basically: the website started as a tiny, personal, Polish-only project
(you can [check out how it used to look](https://web.archive.org/web/20200725174439/https://zaimki.pl/))
created and maintained by me ([@andrea](/@andrea)) – hosted on my personal VPS, domain bought with my personal money etc.
I never really expected the project to grow so much – both in terms of the number of users and contributors.
So the infrastructure (together with associated costs and income) is still mixed up with my personal projects,
and I can only estimate what percentage of “server usage” to attribute to pronouns.page and what to the rest.

## Arc.io

A CDN is a network of servers that host static resources, like images and scripts,
and brings them closer to the user that requests them
(different server serves it to different users based on their geographical location).
Arc.io is a new approach to this technology – instead of tens of big servers, it uses thousands of tiny “servers” – user's devices;
therefore being even closer to the web requests and making websites even faster.
They pay webmasters for adding their widget on their websites and they charge clients for using their CDN.
I've checked their FAQ very carefully and can't find anything shady in their business model – 
they don't track users, they make their presence clearly visible (the icon in bottom left),
they allow an opt-out with just two clicks and without any consequences for website usability,
they don't show ads, don't mine cryptocurrencies, they disable their widget if a user is on mobile data, 
they encrypt all the traffic, etc.

Their dashboard says that over the year they've sent me **$488.40**
(that's €431.74 with today's exchange rate, but I'm not gonna check what it was exactly every single week 😅).
They don't say what percentage of that income came from pronouns.page/zaimki.pl except for the most recent week –
and there the value is around 80%. I think it sounds representative of general traffic share
(comparing with Matomo analytics for example).
So I'll calculate everything else with the assumption that **80% of my server usage is pronouns.page and the remaining 20% are my personal projects**.
(Also, I'll **multiply some values by 1.5 years**, because the website has been online since July 2020).

That gives us **around €345 from pronouns.page traffic** sent from arc.io to my personal PayPal account.

## Server cost

That one is simple: I pay €185.49/year for a VPS from OVH. Let's multiply it by * 80% * 1.5 years,
which means **I spent around €222 from my personal money on the pronouns.page server**.

## Domains

I own three domains related to the project: zaimki.pl (€11.90 * 2 years), another .pl to be published later (€11.90)
and pronouns.page (€11.88 * 2 years).

The initial year is usually way cheaper, around €2-4, but I don't wanna have to look up the exact values
(especially since other numbers here are estimations and a few euro difference is neglectable),
so I'm going to disregard those.
Also for the second year of pronouns.page I paid from the Collective's PayPal, so not counting that either.

So that's basically **€11.90 for domains**.

## AWS

We use the AWS cloud for multiple things:

 - hosting images (profile pics, cards) → that's ~$4 for S3, ~$13 for data transfer,
 - sending out emails → that's ~$4 for SES,
 - hosting our mailbox → that's $4 for WorkMail,
 - generating pronunciation → that's within the free tier.

Adding 19% VAT and converting to EUR that's around €26.5 per month.

Around, because it changes monthly depending on the usage.
I can't compare every single month because until October I've been using it for another very heavy project
(my overall bills were around €50-60/month) and I can't split those bills by project.
Currently, I use AWS exclusively for pronouns.page and two personal WorkMail accounts (which is exactly 2*$4, so easy to deduct).
We haven't always had such heavy usage of the cloud as we have now,
so I won't multiply the cost by 1.5 years, of course – let's assume a half of that time (9 months).

So that's **around €238.5 for the cloud**.

## PhpStorm

The IDE I use to work on the project is great, but unfortunately not free.
I use PhpStorm (technically there's just JavaScript in this project, no PHP, so WebStorm would do too, but PhpStorm supports both and they cost the same),
and it costs €53 + VAT / year.

I think that being the main developer of the project and using the IDE mostly for this project
(again, i think the 80% figure vs. 20% for personal projects sounds quite accurate),
we could count part of the IDE cost as the Collective expense.

So (€53 + VAT) * 80% * 1.5 years = **€75 for the development tools**.

## Summing up the Andrea–Collective relationship

**I've received €345 of income generated by pronouns.page to my personal account and spent €222 + €12 + €238 + €75 = €547 to keep it running,
which means I've given around €200 to the project.**

Which I'm fine with, that's my contribution to the cause 😉
And since all of the calculations above are just estimations, I wouldn't dare asking the Collective about any specific amount back anyway.

## The Collective PayPal

We have a PayPal account, and we collect donations both directly and via ko-fi.com.

Over the time **we've received €426.83 in donations**.

We've spent €11.89 on domain renewal and €16 on a restream.io license for [our first anniversary live stream](https://zaimki.pl/blog/pierwsze-urodziny).

So overall **the Collective has €398.94 in assets** at the moment.

## Decisions

There's two big decisions we're about to make as a group now:

### Do we want to split my personal finances from the collective finances?

The project has grown far beyond the initial state of being my personal pet project,
so it would make sense to have the infrastructure split, both in terms of the cost and income.
It would make it more clear, what's mine and what's shared.

On the other hand that would require work to set up a new machine, new arc.io account, new AWS account etc.
We'd pay for two servers even though the current load is being handled well by just one. 
And the ~€200 I'm giving to the project by paying for the infrastructure would now be a cost for the Collective.

### What do we want to spend our assets on?

We have around €400 to spend and no real plans yet to do so.
It was hard to plan any bigger spending not knowing how much in donations we can expect,
but after 1.5 year of collecting them, we can have a better overview of the options.
A few ideas have come up over the time.

If we decide to split my infrastructure from the project's infrastructure,
there will be that €100–€200 or so gap to cover each year.

Our main focus has always been the Polish version where it's more about
establishing and promoting nonbinary and gender-inclusive in the first place,
rather than just hosting cards. This is where spending might be most needed.

We're preparing [a Polish-language zine about nonbinary experience](https://zaimki.pl/zin) – 
it will be published for free in an electronic form,
but we might also spend our assets to print it, send it to school libraries, etc.

We might want to invest our money in something like a merchandise shop that would both
promote nonbinary language, queer culture and general awareness (eg. selling pronoun pins, mugs, prints of the [Queer Calendar](/calendar))
and also raise money for future initiatives.

And if we don't have better ideas or the processing capacity to actually implement them,
we might just keep collecting donations until such opportunities arise
(eg. until we have enough for some huge project, 
or until new members join who have fresh ideas and the time and skill to implement them, etc.).

Side note: the support section technically says “If you want to chip in for the server, domains, stickers etc.,
_or simply buy the authors a beer_, you can use the links below” –
so I don't think people would be mad, if we spent it on some team party to celebrate a job well done 😉
But to be clear: no alcohol has been bought with that money, we don't have plans to do so,
and even if we wanted to, the team is so spread out geographically, that it's probably not a real possibility anyway 😅

Whichever way we go, rest assured that we intend to spend our funds in ways that we hope will
help us achieve our mission best, to the benefit of the Queer Community.
We promise to keep it transparent and public.
We're also open to suggestions, ideas and cooperation.
