const {Event, day, week, month, dayYear, EventLevel, weekStarting} = require("../../../src/calendar/helpers");

module.exports = [
    // --- months ---
    new Event('{/spis=Niebinarny Spis Powszechny}', 'Nonbinary', 2, month, EventLevel.Month, ['nonbinary']),
    new Event('Miesiąc Historii LGBTQ+ (UK/Węgry/Niderlandy)', 'Progress Pride', 2, month, EventLevel.Month),
    new Event('Miesiąc Historii LGBTQ+ (USA/Kanada/Australia)', 'Progress Pride', 10, month, EventLevel.Month),
    new Event('Miesiąc Historii LGBTQ+ (Kuba/Niemcy)', 'Progress Pride', 5, month, EventLevel.Month),
    new Event('Miesiąc Historii LGBTQ+ (Włochy)', 'Progress Pride', 4, month, EventLevel.Month),
    new Event('Miesiąc Historii LGBTQ+ (Finlandia)', 'Progress Pride', 11, month, EventLevel.Month),
    new Event('Miesiąc Historii Osób {/terminology#transgender=Transpłciowych} (USA)', 'Transgender', 8, month, EventLevel.Month, ['transgender']),

    // --- static date ---
    new Event('Tęczowa Noc', null, 8, day(7), EventLevel.Day),
    new Event('Rocznica Dekryminalizacji Homoseksualności w Polsce (1932)', '_law', 9, day(1), EventLevel.Day, ['homosexual', 'gay']),
    new Event('Rocznica Rozpoczęcia Akcji „Hiacynt” (1985)', null, 11, day(15), EventLevel.Day, ['homophobia']),
    new Event('{https://www.facebook.com/429249150318/posts/10164869405325319=Polski Dzień Osób Niebinarnych}', 'Nonbinary', 3, day(9), EventLevel.Day, ['nonbinary']),
    new Event('Dzień Pamięci Milo Mazurkiewicz', '_black-ribbon', 5, day(6), EventLevel.Day, ['transgender', 'nonbinary']),
    new Event('{https://www.instagram.com/p/CY_mGaGo9sm/=Dzień Dziabka}', 'Nonbinary', 1, day(23), EventLevel.Day, ['nonbinary']),
    new Event('Dzień Harveya Milka (USA)', null, 5, day(22), EventLevel.Day),
    new Event('Dzień Różowego Trójkąta (Kanada)', null, 2, day(14), EventLevel.Day),
    new Event('Dzień Pamięci {https://pl.wikipedia.org/wiki/Matthew_Shepard=Matthew Sheparda}', '_black-ribbon', 10, day(12), EventLevel.Day),
    new Event('Dzień Widoczności Lesbijek na Spektrum Multiseksualności', '_mspec_lesbians', 5, day(26), EventLevel.Day, ['mspec lesbian', 'bi lesbian', 'bi gay']),
    new Event('Tydzień Widoczności Lesbijek na Spektrum Multiseksualności', '_mspec_lesbians', 5, weekStarting(22), EventLevel.Week, ['mspec lesbian', 'bi lesbian', 'bi gay']),
    new Event('Dzień Pamięci {https://pl.wikipedia.org/wiki/Marielle_Franco=Marielle Franco} (Brazylia)', '_black-ribbon', 3, day(14), EventLevel.Day),
    new Event('Międzynarodowy Dzień Osób Pracujących Seksualnie', '_sex-work', 6, day(2), EventLevel.Day),
    new Event('Dzień Dumy Osób Pracujących Seksualnie', '_sex-work', 9, day(14), EventLevel.Day),
    new Event('Międzynarodowy Dzień Przeciwko Przemocy Wobec Osób Pracujących Seksualnie', '_sex-work', 12, day(17), EventLevel.Day),
    new Event('Międzynarodowy Dzień Praw Osób Pracujących Seksualnie', '_sex-work', 3, day(3), EventLevel.Day),     

    // --- one-off events ---
    new Event('{https://www.facebook.com/events/494846264855467=Parada Równości 2021 (Warszawa)}', 'LGBTQ', 6, dayYear(19, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/488657855710176=10. Marsz Równości w Łodzi // #DajcieŻyć}', 'LGBTQ', 6, dayYear(26, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/410978689971744=Marsz Równości / Poznań Pride Week 2021}', 'LGBTQ', 7, dayYear(3, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/268787238127715=Krakowski Marsz Równości}', 'LGBTQ', 8, dayYear(14, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/3014862102117309=III Marsz Równości w Częstochowie}', 'LGBTQ', 8, dayYear(21, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/2452153495099319=VI Trójmiejski Marsz Równości}', 'LGBTQ', 8, dayYear(21, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/899343277314079=I Marsz Równości w Pile}', 'LGBTQ', 8, dayYear(28, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/836510793718521=IV Marsz Równości w Zielonej Górze}', 'LGBTQ', 8, dayYear(29, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/201952825229094=II Marsz Równości w Koszalinie - łączy nas miłość!}', 'LGBTQ', 9, dayYear(4, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/=342009100868673=2. Frankfurt Słubice Pride}', 'LGBTQ', 9, dayYear(5, 2021), EventLevel.Day),
    new Event('Katowicki Marsz Równości', 'LGBTQ', 9, dayYear(11, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/245026010553901=3. Szczeciński Marsz Równości}', 'LGBTQ', 9, dayYear(18, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/567277200983253=I Bielski Marsz Równości}', 'LGBTQ', 9, dayYear(19, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/579750703021865=III Marsz Równości w Opolu}', 'LGBTQ', 9, dayYear(25, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1593757500834654=13. Wrocławski Marsz Równości}', 'LGBTQ', 10, dayYear(2, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1066052000600920=II Marsz Równości w Białymstoku}', 'LGBTQ', 10, dayYear(9, 2021), EventLevel.Day),
    new Event('{http://marszlublin.pl/=III Marsz Równości w Lublinie}', 'LGBTQ', 10, dayYear(23, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1549709465370766=I Wodzisławski Marsz Równości}', 'LGBTQ', 10, dayYear(16, 2021), EventLevel.Day),
    new Event('{https://www.facebook.com/events/272344485002292=14. Wrocławski Marsz Równości}', 'LGBTQ', 6, dayYear(11, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/778731303070898=VII Trójmiejski Marsz Równości}', 'LGBTQ', 5, dayYear(28, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/620469522712842=3. Marsz Równości w Koszalinie}', 'LGBTQ', 4, dayYear(2, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/MarszRownosciGniezno=II Marsz Równości w Gnieźnie}', 'LGBTQ', 5, dayYear(7, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1010798579854725/=11. Marsz Równości w Łodzi}', 'LGBTQ', 5, dayYear(14, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/queerowymaj/=Krakowski Marsz Równości}', 'LGBTQ', 5, dayYear(21, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/634419277601853=I Marsz Równości w Sanoku}', 'LGBTQ', 6, dayYear(4, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/4701525936612004=V Marsz Równości w Zielonej Górze}', 'LGBTQ', 6, dayYear(4, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/670481497600736=Parada Równości 2022} (Warszawa)', 'LGBTQ', 6, dayYear(25, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1014397512828851/=Marsz Równości w Poznaniu}', 'LGBTQ', 7, dayYear(2, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/queerce=Marsz Równości w Kielcach}', 'LGBTQ', 7, dayYear(9, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1593099004379743=IV Marsz Równości w Opolu}', 'LGBTQ', 7, dayYear(16, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/698107478207024=3. Marsz Równości na Woodstocku} (Czaplinek)', 'LGBTQ', 8, dayYear(6, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/521102249311233=Szczeciński Marsz Równości}', 'LGBTQ', 8, dayYear(20, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/413636720098790/=I Marsz Równości w Miliczu}', 'LGBTQ', 5, dayYear(22, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/events/1462034324230653/=1. Transgraniczny Marsz Równości Gryfino-Mescherin}', 'LGBTQ', 5, dayYear(22, 2022), EventLevel.Day),
    new Event('Marsz Równości {https://www.facebook.com/events/1462034324230653/=Słubice-Frankfurt-Pride}', 'LGBTQ', 9, dayYear(4, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/wolnoscrownosctolerancja/=II Wodzisławski Marsz Równości}', 'LGBTQ', 8, dayYear(27, 2022), EventLevel.Day),
    new Event('{https://www.facebook.com/Bielski-Marsz-R%C3%B3wno%C5%9Bci-108906844819983/=II Bielski Marsz Równości}', 'LGBTQ', 7, dayYear(3, 2022), EventLevel.Day),
    new Event('Dzień Świadomości nt. Równych Płac dla Osób LGBTQIA+', '_hrc', 6, dayYear(16, 2021), EventLevel.Day),
    new Event('Dzień Świadomości nt. Równych Płac dla Osób LGBTQIA+', '_hrc', 6, dayYear(15, 2022), EventLevel.Day),
    new Event('Wiosenny Europejski Tydzień Testowania w Kierunku HIV', '_red-ribbon', 5, weekStarting(16, 2022), EventLevel.Week, ['aids']),
    new Event('Jesienny Europejski Tydzień Testowania w kierunku HIV', '_red-ribbon', 11, weekStarting(21, 2022), EventLevel.Week, ['aids'])    

    // --- dynamic date ---

    // last Friday of October
    new Event('{https://pl.wikipedia.org/wiki/T%C4%99czowy_Pi%C4%85tek=Tęczowy Piątek}', 'LGBTQ', 10, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    // last Friday of August
    new Event('Fioletowy Piątek (Australia)', null, 8, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    // last Friday of February
    new Event('Fioletowy Piątek (UK)', null, 2, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.Day),

    // second Friday of December
    new Event('Fioletowy Piątek (Niderlandy)', null, 12, function* (monthDays) {
        let fridays = 0;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                fridays++;
                if (fridays === 2) {
                    yield d;
                    return;
                }
            }
        }
    }, EventLevel.Day),
];
