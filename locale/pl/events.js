import {Event, day, week, month, dayYear, EventLevel} from "../../src/calendar/helpers";

export default [
    // static date
    new Event('Tęczowa Noc', null, 8, day(7), EventLevel.MajorDay),
    new Event('Rocznica Dekryminalizacji Homoseksualności w Polsce (1932)', null, 9, day(1), EventLevel.MajorDay),
    new Event('Rocznica Rozpoczęcia Akcji „Hiacynt” (1985)', null, 11, day(15), EventLevel.MajorDay),        

    // namedays
    // new Event('Imieniny: Andrea', null, 4, day(30), EventLevel.MinorDay),

    // one-off events
    new Event('{https://www.facebook.com/events/494846264855467=Parada Równości 2021 (Warszawa)}', 'LGBTQ', 6, dayYear(19, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/488657855710176=10. Marsz Równości w Łodzi // #DajcieŻyć}', 'LGBTQ', 6, dayYear(26, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/410978689971744=Marsz Równości / Poznań Pride Week 2021}', 'LGBTQ', 7, dayYear(3, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/268787238127715=Krakowski Marsz Równości}', 'LGBTQ', 8, dayYear(14, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/3014862102117309=III Marsz Równości w Częstochowie}', 'LGBTQ', 8, dayYear(21, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/2452153495099319=VI Trójmiejski Marsz Równości}', 'LGBTQ', 8, dayYear(21, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/899343277314079=I Marsz Równości w Pile}', 'LGBTQ', 8, dayYear(28, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/836510793718521=IV Marsz Równości w Zielonej Górze}', 'LGBTQ', 8, dayYear(29, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/201952825229094=II Marsz Równości w Koszalinie - łączy nas miłość!}', 'LGBTQ', 9, dayYear(4, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/=342009100868673=2. Frankfurt Słubice Pride}', 'LGBTQ', 9, dayYear(5, 2021), EventLevel.MajorDay),
    new Event('Katowicki Marsz Równości', 'LGBTQ', 9, dayYear(11, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/245026010553901=3. Szczeciński Marsz Równości}', 'LGBTQ', 9, dayYear(18, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/567277200983253=I Bielski Marsz Równości}', 'LGBTQ', 9, dayYear(19, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/579750703021865=III Marsz Równości w Opolu}', 'LGBTQ', 9, dayYear(25, 2021), EventLevel.MajorDay),
    new Event('{https://www.facebook.com/events/1593757500834654=13. Wrocławski Marsz Równości}', 'LGBTQ', 10, dayYear(2, 2021), EventLevel.MajorDay),

    // dynamic date
    new Event('{https://pl.wikipedia.org/wiki/T%C4%99czowy_Pi%C4%85tek=Tęczowy Piątek}', null, 10, function* (monthDays) {
        let lastFriday = null;
        for (let d of monthDays) {
            if (d.dayOfWeek === 5) {
                lastFriday = d;
            }
        }
        yield lastFriday;
    }, EventLevel.MajorDay),
];
