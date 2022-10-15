# Validating fields in the card editor form

<small>2022-10-15 | [@andrea](/@andrea)</small>

![Screenshot of a test account abusing the unlimted length of fields](/img-local/blog/length-validation.png)

It's a standard procedure in web forms to impose limits on what can be posted through it –
for example if a user requests changing their email to `sgjbdgkjdfsg` the form should fail
without even trying to send a confirmation email to `sgjbdgkjdfsg` because it's not a valid email address.
And on pronouns.page that does happen… in most places 😅 well, it's kinda embarrassing, but…
up until recently the profile editor wasn't validating its input too well 😅

In that area I admit I was cutting corners a bit – 
being too used to using a different framework that basically does such validation for me almost out of the box,
and not thinking that this section of the website would be used much anyway (lol, little did I know 😂).
It's not like it was an unreasonable setup or like we didn't have other measures in place.
We do, for example, limit `client_max_body_size` in nginx.
If somebody wants to put “invalid” pronouns on their card
(in terms of their technical format that the code doesn't understand, not questioning their validity),
we'll save it in the database but just won't display a broken link publicly
(which will allow them to later edit it and fix the formatting).
If somebody puts a malicious code there, we'll escape it on display to prevent XSS attacks.
If somebody wants to put in 6000 items in the “names” field, well, it's their card, let them do so –
it's just their own card, it's not like they're gonna break the whole website with it, leak any data, or anything serious.
And it's not like somebody is gonna actually put 6000 items in one list anyway, right?

Well, they did. That really happened 😅 And also, technically attackers _might_ do some damage that way.
To our knowledge, this little loophole had never seriously affected the operation of the website,
and if did, it would be relatively easy to mitigate, but allowing unlimited size of a card
(well, not _entirely_ “unlimited” because of `client_max_body_size`)
might technically become a security issue.

Limiting the number of items allowed in a web form is a security measure.
It prevents a category of attacks in which the attacker floods the server with huge requests,
fills up our database with trash data, therefore increases our maintenance costs,
slows down the page, wastes server resources and forces visitors
to fetch potentially hundreds of megabytes of data when simply opening a card.
It could’ve been exploited even further using the card image generation feature
which uses more resources than regular operations on the website.

Even if done in good faith and kept way bellow the `client_max_body_size`,
putting hundreds or thousands of names, pronouns or flags in one's card might still be quite disrespectful
towards some visitors with slower connections and older devices – making their browser render stuff above its capacity,
even though most likely no visitor might even actually read the entirety of such a profile.
Such amounts of data should normally be _paginated_ when shown to a user –
but to be paginated would go against the definition of a “card”
(one should be able just print out a card on a single sheet of paper),
and it's a relatively big effort to implement considering that it would only accommodate _half a promile_ of all cards.
Limiting the number of items allowed helps keep the consistency of cards’ design as… well, cards,
as in business cards – _short_ summaries of information about a person.

In other words: limiting the number of entries and the length of each field is necessary and a good practice for many reasons.
It should've been in place from the beginning, but better late than never.
The only question is: what should those values be exactly?
We're trying not to be judgemental about anyone's card, let them express their identity in whichever way they see fit.
As much as we might find it hard to believe that someone _actually_ uses a thousand names in real life in all practical ways a person might use a name –
who knows, maybe they do 🤷 But we also need to draw a _reasonable_ line _somewhere_. 
Our [Terms of Service](/terms) forbid posting spam – but is there any _specific_ number after which an identity becomes a “spam”?
I guess the only real distinction is based on intentions – but how can we know someone's intentions?

So we need to stick to raw data and meaningful numbers.
We have a database, we know the distribution of length of each profile field –
and no surprise there, it's basically Gaussian distribution
For names and pronouns it's centred around 3 items/card, 
for flags it's 2, for custom flags the most common value is actually 0,
and words, unsurprisingly, most often have the same number of items that are in the default set proposed by us.
An example distribution looks like this:

![A histogram of pronoun field length, natural distribution, peak at 3, drops to almost invisible numbers around length=20. To vertical lines added: at 64 and 128](/img-local/blog/distribution-pronouns-count.png)

For each of those fields setting a cutoff point at **64 items per card** is way above the heel of the bell curve.
With an exception of custom flags, where that value is slightly higher,
limiting any field to 64 items would only affect **around half a promile of cards**.
**If we double that limit to 128 items everywhere – we cover around 99.99% of all cards.**
Cards with more items than that are statistically outliers,
and try as I might, I cannot justify setting a limit even higher than that.

Profiles that already exist and exceed that limit **have not been modified in any way**,
I would't just remove the extra data without a warning.
But the validation is in place now, which means trying to edit one's card and save the changes that still exceed the limit
will fail and  show an error message.

What I didn't consider in my analysis, though, is that people who put tens and hundreds and thousands of items in their cards,
albeit relatively few, would also be people most highly invested in keeping the limits nonexistent.
This week we've received more emails than I have time to respond to, asking for a justification of that change.
And fair enough, a justification is due, hence this blog post.

Basically… Sanitising form input is a standard procedure that's important for security and for user experience.
Implementing it was not malicious or sudden, it was just… overdue.
Choosing a limit must by definition be an arbitrary decision,
but it was not intended to invalidate anyone's identity and was based on analysis of real-life data.
The chosen limits are way bigger than the usual values we see in practice,
they ensure that 99.99% of cards are unaffected, and they are so high
that they still violate the general idea that a card should be printable on a single sheet of paper.
If even _this_ kind of limit is still not big enough for you –
I'm afraid you're simply using this tool in a way that it wasn't intended to be used.
