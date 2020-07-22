import { Article, Book, Example, Template } from './classes'

export const examples = [
    Example.parse('Myślę, że {pronoun_n} jest bardzo mił{adjective_n}.|Myślę, że {pronoun_n} są bardzo mi{adjective_ll}{adjective_n}'),
    Example.parse('Tęsknię za {pronoun_g} śmiechem.'),
    Example.parse('Napiszę do {pronoun_g_acc} później'),
    Example.parse('Powiedział{verb_middle}m {pronoun_d}, że {pronoun_a} lubię.|Powiedzi{verb_middle}śmy {pronoun_d}, że {pronoun_a} lubimy.'),
    Example.parse('Chciał{verb_end}bym pójść do kina.|Chci{verb_middle}byśmy pójść do kina.'),
    Example.parse('Czy będziesz grał{verb_end} z nami?|Czy będziecie gra{verb_end} z nami?'),
    Example.parse('Kiedy będziesz m{verb_o}gł{verb_end} się z nami spotkać?|Kiedy będziecie m{verb_o}g{verb_end} się z nami spotkać?'),
    Example.parse('Gdy był{verb_middle}m w domu, zacz{verb_nasal}ł{verb_middle}m gotować.|Gdy by{verb_end}śmy w domu, zacz{verb_nasal}śmy gotować.'),
    Example.parse('Dostał{verb_middle}m wyniki egzaminu i jestem z nich zadowolon{adjective_n}.|Dosta{verb_end}śmy wyniki egzaminu i jesteśmy z nich zadowol{adjective_middle}n{adjective_n}.'),
    Example.parse('Po{verb_go}{verb_middle}m z {pronoun_i} do szkoły.|Po{verb_go}śmy z {pronoun_i} do szkoły.'),
    Example.parse('Rozmawialiśmy o {pronoun_l} ostatnio.'),
    Example.parse('Każd{adjective_n} z nich chciał{verb_end} czego innego.|Wszys{pronoun_all} z nich chci{verb_middle} czego innego.'),
    Example.parse('To miło, że nas {honorific} odwiedził{verb_end}.|To miło, że nas {honorific} odwiedzi{verb_end}.'),
];

export const templates = {
    on: new Template('Rodzaj męski', {
        'pronoun_n': 'on',
        'pronoun_g': 'jego',
        'pronoun_g_acc': 'niego',
        'pronoun_d': 'mu',
        'pronoun_a': 'go',
        'pronoun_i': 'nim',
        'pronoun_l': 'nim',
        'pronoun_all': null,
        'adjective_n': 'y',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': '',
        'verb_middle': 'e',
        'verb_nasal': 'ą',
        'verb_go': 'szedł',
        'verb_o': 'ó',
        'honorific': 'pan',
    }, false),
    ona: new Template('Rodzaj żeński', {
        'pronoun_n': 'ona',
        'pronoun_g': 'jej',
        'pronoun_g_acc': 'niej',
        'pronoun_d': 'jej',
        'pronoun_a': 'ją',
        'pronoun_i': 'nią',
        'pronoun_l': 'niej',
        'pronoun_all': null,
        'adjective_n': 'a',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': 'a',
        'verb_middle': 'a',
        'verb_nasal': 'ę',
        'verb_go': 'szł',
        'verb_o': 'o',
        'honorific': 'pani',
    }, false),
    ono: new Template('Rodzaj nijaki', {
        'pronoun_n': 'ono',
        'pronoun_g': 'jego',
        'pronoun_g_acc': 'niego',
        'pronoun_d': 'mu',
        'pronoun_a': 'go',
        'pronoun_i': 'nim',
        'pronoun_l': 'nim',
        'pronoun_all': null,
        'adjective_n': 'e',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': 'o',
        'verb_middle': 'o',
        'verb_nasal': 'ę',
        'verb_go': 'szł',
        'verb_o': 'o',
        'honorific': 'pań',
    }, false, [
        new Article(
            'Małgorzata Goślińska',
            'Zrobimy z ciebie mężczyznę',
            'w: „Magazyn TVN24”',
            2019,
            [
                'Milo nie miało myśli erotycznych. Tak boleśnie myślało o własnym ciele, że nie potrafiło myśleć o nim w towarzystwie innych ciał. Ale żeby zmienić ciało, musiało odpowiedzieć u psychologa na pytania: Od kiedy się masturbujesz? Jak to robisz? O czym wtedy myślisz? W jakiej pozycji uprawiasz seks? Jak się całujesz? Milo było rozdarte, nie lubiło kłamać.',
                'Przez jeden dzień Milo się cieszyło. Ale to był krok w bok. Milo nie posunęło się do przodu w kierunku tranzycji prawnej ani medycznej. Uznali imię, nie tożsamość. W dowodzie pozostała literka M. Milo było osobą niebinarną, ale z dwojga złego wolałoby literkę K. Było rozdarte. Nie lubiło swojego męskiego ciała, dlatego postanowiło przejść tranzycję. Ale nie po to wyrwało się z klatki chłopca, żeby wejść w kolejną klatkę. Chciało być sobą.',
            ],
            'Milo - historia życia i śmierci',
            'https://tvn24.pl/magazyn-tvn24/zrobimy-z-ciebie-mezczyzne,242,4189'
        ),
        new Book(
            'Bartek Biedrzycki',
            'Confirmatio Vir Llamki, albo o wizycie Nieziemca Macka Simma na Starej Ziemi',
            'w: „Dzieje się”',
            2018,
            ['Usiedli. Vir wskoczyło na łóżko i zainstalowało się tam po turecku, Simm przysiadł na obrotowym krześle przy biurku.\n– Jak dorosnę, to chcę polecieć na Marsa.\n– Przecież już byłoś u mnie dwa razy.\n– Ale ja chcę na stałe'],
        ),
        new Book(
            'Anna Kańtoch',
            'Niepełnia',
            '',
            2017,
            ['Ale Sło­neczko oczy­wi­ście chciało, i to bar­dzo. Chciało i bało się jed­no­cze­śnie, ponie­waż wie­rzyło matce. Świat na zewnątrz był piękny, ale też okrutny – zwłasz­cza dla takich jak ono. Bo Sło­neczko, choć nikt ni­gdy nie powie­dział mu tego wyraź­nie, wie­działo, że różni się od zwy­czaj­nych dzieci, a ludzie nie lubią tego, co inne.'],
        ),
        new Book(
            'Marta Kisiel',
            'Dożywocie',
            '',
            2010,
            ['Starało się zrobić wrażenie bardzo zasmuconego i stanowczego jednocześnie, aczkolwiek nie wzięło pod uwagę faktu, że wygląd trochę wchodzi mu w paradę. Owszem, peleryna świetnie maskowała skrzydła, ale poza tym była zdecydowanie zbyt wielka na jedno małe Licho.'],
        ),
        new Book(
            'Marta Kisiel',
            'Małe Licho i tajemnica Niebożątka',
            '',
            2018,
        ),
        new Book(
            'Marta Kisiel',
            'Małe Licho i anioł z kamienia',
            '',
            2019,
        ),
        new Book(
            'Marta Kisiel',
            'Siła niższa',
            '',
            2016,
            ['– Ja co prawda słabo znam gościa - odparł po kilku chwilach - ale tak sobie myślę, że on to nie lubi nikogo. \n– Nawet swojego człowieka? Przecież jest aniołem stróżem. Ja swoich zawsze lubiłom. Jak miałobym im stróżować bez lubienia?'],
        ),
        new Book(
            'Maja Lidia Kossakowska',
            'Siewca wiatru',
            '',
            2004,
        ),
        new Book(
            'Yoon Ha Lee',
            'Smocza perła',
            'tłumaczenie: Agnieszka Fulińska i Aleksandra Klęczar',
            2019,
            ['– Idzie ci lepiej niż zwykle – oznajmiło w końcu Sujin. Nie zauważyłam, że pogrążone w lekturze książki dotyczącej chemii zwracało na nas w ogóle uwagę.'],
        ),
        new Book(
            'Stanisław Lem',
            'Maska',
            'w zbiorze „Maska”',
            1976,
        ),
        new Book(
            'Anna Łagan',
            'Ekonomia to dolina niesamowitości',
            'w: „Skafander i melonik”',
            2018,
            ['– Oczywiście – zgodziło się Manu. – Właśnie przeprowadziłom analizę skutków obniżenia moich cen i mimo że widzę wiele niedogodności i nieprzyjemnych konsekwencji, rozumiem, że jak p. powiedział, jest to na ten moment najlepsze rozwiązanie problemu. Zgadzam się na zmianę umowy i obniżenie kosztów… Oto cena, którą p. proponuję.'],
        ),
        new Book(
            'Ian McDonald',
            'Rzeka bogów',
            'tłumaczenie: Wojciech Próchniewicz',
            2010,
            ['Poznali się, ślub, sześć miesięcy później - ja. I zanim zapytasz: nie. Byłom jedynakiem. Moi rodzice byli atrakcją na Chowpatty Beatch. Brali mnie na wszystkie imprezy, byłom prawdziwą ozdobą.'],
        ),
        new Book(
            'Ada Palmer',
            'Do błyskawicy podobne',
            'tłumaczenie: Michał Jakuszewski',
            2019,
        ),
        new Book(
            'Ada Palmer',
            'Siedem kapitulacji',
            'tłumaczenie: Michał Jakuszewski',
            2019,
        ),
        new Book(
            'Joanna Krystyna Radosz',
            'Listopad bez snów',
            'w: „Tęczowe i fantastyczne”',
            2020,
            ['Gdy je otwieram, rozlega się zgrzyt zamka w drzwiach, przedpokój zalewa fala światła, a z głębi mieszkania dobiega lekko bełkotliwy głos Mady:\n– ...a ja byłom jak: kupiliśmy trzyosobowy materac, a ty gardzisz!']
        ),
        new Book(
            'Aleksandra Stanisz',
            'Ofiara',
            'w: „Umieranie to parszywa robota”',
            2019,
        ),
        new Book(
            'A. Szydlik',
            'Jak uratować kotka z nawiedzonego domu',
            'w: „Tęczowe i fantastyczne”',
            2020,
            ['Znalazłom ten portfel na przystanku, wciśnięty między krzesełka. Podniosłom go, trochę bezmyślnie, trochę dla zabicia czasu. Autobus miał przyjechać za kwadrans. Mogłom co prawda iść piechota ̨, ale było ciemno, zimno i lało, a ja byłom bardzo zmęczone. Usiadłom więc na plastikowym krzesełku i otworzyłom portfel.'],
        ),
    ]),
    onu: new Template('Rodzaj postpłciowy, dukaizmy', {
        'pronoun_n': 'onu',
        'pronoun_g': 'jenu',
        'pronoun_g_acc': 'nienu',
        'pronoun_d': 'nu',
        'pronoun_a': 'nu',
        'pronoun_i': 'num',
        'pronoun_l': 'num',
        'pronoun_all': null,
        'adjective_n': 'u',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': 'u',
        'verb_middle': 'u',
        'verb_nasal': 'ę',
        'verb_go': 'szł',
        'verb_o': 'o',
        'honorific': 'panu',
    }, false, [
        new Article(
            'Rozmowa Ewy Tomaszewicz',
            'Magdalenę Stonawską i Loë Fjorsigviss łączy nie tylko miłość, ale też pasja: obie lewicują fanów na konwentach fantastycznych.',
            'w: „Replika” #83',
            2020,
            ['<em>– Powiedzcie kilka słów o sobie.</em>\n' +
            '<em>MS:</em> Nazywam się Magdalena Stonawska i lewicuję fanów fantastyki, to znaczy staram się wpuszczać do życia fandomu tematykę tęczowo-równościową, której jest tam moim zdaniem za mało.\n' +
            '<em>LF:</em> Mnie wszyscy znają jako Loë Fjorsigviss. Organizuję konwenty fantastyczne od prawie pięciu lat. Lewicowanie fandomu przyszło mi naturalnie.\n' +
            '<em>– Loë, ty osobą niebinarną, prawda?</em>\n' +
            '<em>LF:</em> Tak, nic jestem dziewczynką. I zdecydowanie nie jestem chłopcem\n.' +
            '<em>– Jak powinnam do ciebie mówić?</em>\n' +
            '<em>LF:</em> Formy żeńskie są w porządku, używam ich z przyzwyczajenia, ale coraz częściej korzystam też z zaimków „dukajowych”.\n' +
            '<em>– Czyli?</em>\n' +
            '<em>LF:</em> Jacek Dukaj w „Perfekcyjnej niedoskonałości” opisał postaci postludzkie (Post Haman Being, phoebe), które nie miały fizycznego ciała i ukazywały się w formie hologramów. Używały neutralnych zaimków. Dukaj nie chciał używać zaimków nijakich, więc stworzył formy z „u”: „onu zrobiłu”, „jenu sprawa” itp. Obecnie to jedna z opcji coraz chętniej wybieranych przez osoby niebinarne w Polsce.\n' +
            '<em>– Na pewno zdarzyło ci się dyszeć, że wymyślanie kolejnych form i zaimków to jakaś fanaberia. Dlaczego to, jak się do ciebie zwracają inni, jest ważne?</em>\n' +
            '<em>LF:</em> Od kiedy pamiętam, uwierało mnie mówienie o sobie jako o dziewczynie czy kobiecie. Nie utożsamiałum się z tym. Zorientowałum się, że mogę nie być kobietą, nie ze względu na dysforię płciową, tylko ze względu na euforię. Kiedy dopuściłum do siebie myśl, że są inne opcje, zaczęłum esksperymentować i poprosiłum parę znajomych osób, żeby spróbowały tak się do mnie zwracać. Gdy zaczęły tak do mnie mówić, poczułum ogromną ulgę. Kiedy mówię o sobie, ta inna forma przychodzi mi z trudem, ciągle samu mam z nią problem, ale to uczucie, kiedy inni mówią o mnie w ten sposób, powiedziało mi, że to może być faktycznie dobry kierunek, że nie jestem dziewczyną ani chłopakiem, ale kimś poza tym. I to było naprawdę wspaniałe i wyzwalające uczucie.'],
            '',
            'https://replika-online.pl/spis-tresci-83/',
        ),
        new Book(
            'Jacek Dukaj',
            'Perfekcyjna niedoskonałość',
            '',
            2003,
            ['– Do Creytona powinniśmy dotrzeć w ciągu trzydziestu ośmiu k-godzin. Nawet zważywszy na utratę krwi pana i stahs McPherson– \n– Chciałuś powiedzieć – przerwał nu Zamoyski – powinniśmy byli tam dotrzeć. Samu twierdzisz, że po odcięciu od Plateau nie wiesz nawet, w którą stronę lecimy. Swoją drogą, zastanawiam się, jak to możliwe. Przecież chyba pamiętasz, gdzie celowałuś.'],
        ),
        new Book(
            'Ginny Nawrocka',
            'Cierpki zapach kosmosu',
            'w: „Tęczowe i fantastyczne”',
            2020,
            ['Ja, Gosia, Ewa i Jacek. Gosia była najmłodsza... Jest najmłodsza. Jacek jest z tego samego roku, co ja, ale onu urodziłu się na początku, a ja pod koniec. A Ewa jest pięć lat starszy ode mnie.'],
            'oprócz tego także postaci niebinarne używające męskich i żeńskich form',
        ),
        new Book(
            'Artur Nowrot',
            'Smocze dziecko',
            'w: „Tęczowe i fantastyczne”',
            2020,
            ['Yare robiłu jednak, co w jenu mocy, by zadowolić rodziców i starszyznę, wykonywać bez zwłoki polecenia, nie zaniedbywać obowiązków i za bardzo nie narzekać.'],
            'przymiotniki w formie nijakiej', // TODO separate?
        ),
        new Book(
            'Kelly Robson',
            'Interwencja',
            'w: „Nowa Fantastyka” 5/2020; tłumaczenie: Paweł Dembowski',
            2020,
            ['Émeraude odpięłu się i pokazału palec lekarce. Przełączału się między dwoma trybami – wszystko albo nic. Kilka miesięcy temu doznału kontuzji, naciągając mocno ścięgno zginacza.'],
        ),
    ]),
    oni: new Template('Formy męskoosobowe liczby mnogiej', {
        'pronoun_n': 'oni',
        'pronoun_g': 'ich',
        'pronoun_g_acc': 'nich',
        'pronoun_d': 'im',
        'pronoun_a': 'ich',
        'pronoun_i': 'nimi',
        'pronoun_l': 'nich',
        'pronoun_all': 'cy',
        'adjective_n': 'i',
        'adjective_ll': 'l',
        'adjective_middle': 'e',
        'verb_end': 'li',
        'verb_middle': 'eli',
        'verb_nasal': 'ęli',
        'verb_go': 'szli',
        'verb_o': 'o',
        'honorific': 'państwo',
    }, true, [
        new Book('Karolina Fedyk', 'Skrzydła', '', 2019),
        new Book('Weronika Mamuna', 'Obca, która była', 'w: „Tęczowe i fantastyczne”', 2020),
        new Book('Agnieszka Żak', 'Dorastanie w czasach cyborgizacji', 'w: „Tęczowe i fantastyczne”', 2020),
    ]),
    one: new Template('Formy niemęskoosobowe liczby mnogiej', {
        'pronoun_n': 'one',
        'pronoun_g': 'ich',
        'pronoun_g_acc': 'nich',
        'pronoun_d': 'im',
        'pronoun_a': 'je',
        'pronoun_i': 'nimi',
        'pronoun_l': 'nich',
        'pronoun_all': 'tkie',
        'adjective_n': 'e',
        'adjective_ll': 'ł',
        'adjective_middle': 'o',
        'verb_end': 'ły',
        'verb_middle': 'ały',
        'verb_nasal': 'ęły',
        'verb_go': 'szły',
        'verb_o': 'o',
        'honorific': 'państwo',
    }, true, [
        new Book('Artur Nowrot', 'Smocze dziecko', 'w: „Tęczowe i fantastyczne”', 2020),
    ]),
    onx: new Template('Formy z iksem', {
        'pronoun_n': 'onx',
        'pronoun_g': 'jex',
        'pronoun_g_acc': 'nix',
        'pronoun_d': 'jex',
        'pronoun_a': 'jex',
        'pronoun_i': 'nix',
        'pronoun_l': 'nix',
        'pronoun_all': null,
        'adjective_n': 'x',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': 'x',
        'verb_middle': 'x',
        'verb_nasal': 'ę',
        'verb_go': 'szł',
        'verb_o': 'o',
        'honorific': 'panx',
    }, false, []),
    on_: new Template('Formy z podkreślnikiem', {
        'pronoun_n': 'on_',
        'pronoun_g': 'je_',
        'pronoun_g_acc': 'ni_',
        'pronoun_d': 'je_',
        'pronoun_a': 'je_',
        'pronoun_i': 'ni_',
        'pronoun_l': 'ni_',
        'pronoun_all': null,
        'adjective_n': '_',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': '_',
        'verb_middle': '_',
        'verb_nasal': 'ę',
        'verb_go': 'szł',
        'verb_o': 'o',
        'honorific': 'pan_',
    }, false, [
        new Book('R.S. Benedict', 'Moje angielskie imię', 'w: „Nowa Fantastyka 3/2019', 2019),
    ]),
    vono: new Template('Rodzaj nijaki z neozaimkami vono/viego', {
        'pronoun_n': 'vono',
        'pronoun_g': 'viego',
        'pronoun_g_acc': 'viego',
        'pronoun_d': 'vu',
        'pronoun_a': 'vo',
        'pronoun_i': 'vim',
        'pronoun_l': 'vim',
        'pronoun_all': null,
        'adjective_n': 'e',
        'adjective_ll': null,
        'adjective_middle': null,
        'verb_end': 'o',
        'verb_middle': 'o',
        'verb_nasal': 'ę',
        'verb_go': 'szł',
        'verb_o': 'o',
        'honorific': 'pań',
    }, false, [
        new Book(
            'Greg Egan',
            'Stan wyczerpania',
            'tłum. Paweł Wieczorek',
            2003,
            ['Kuwale było tylko pół pokolenia młodsze ode mnie i prawdopodobnie mieliśmy wiele podobnych poglądów na świat, vono jednak nieco ekstremalniej wierzyło we wszystko to, w co wierzyliśmy my. Nauka i technologia zdawały się dawać vu wszystko, czego chciało.'],
        ),
    ]),
};

export const otherSources = [
    // niebinarne on
    new Book('Ursula K. Le Guin', 'Lewa ręka ciemności', 'tłum. Lech Jęczmyk', 1987, [], 'postać niebinarna używająca form męskich'),

    // niebinarne ona
    new Book('Ann Leckie', 'Zabójcza sprawiedliwość', 'tłum. Danuta Górska', 2015, [], 'postać niebinarna używająca form żeńskich'),
    new Book('Ann Leckie', 'Zabójczy miecz', 'tłum. Danuta Górska', 2016, [], 'postać niebinarna używająca form żeńskich'),
    new Book('Ursula K. Le Guin', 'Królowa Zimy', 'w: „Wszystkie strony świata”', 'tłum. Lech Jęczmyk', 1980, 'postać niebinarna używająca form żeńskich'),

    // neozaimki
    new Book(
        'Greg Egan',
        'Diaspora',
        'tłumaczenie: Michał Jakuszewski',
        2015,
        ['Yatima przyjrzało się otaczającym polis gwiazdom. Wszystkie emitowały światło o widmie przesuniętym w wyniku efektu Dopplera, tworząc na niebie nieruchome koncentryczne fale koloru - od ekspansji po konwergencję. Ve zastanawiało się, jak powinni się zachować, gdy wreszcie dościgną uciekających.'],
        'rodzaj nijaki z neozaimkami ve/vir',
    ),

    // genderfluid
    new Book('Rick Riordan', 'Młot Thora', '', 2016, [], 'postać genderfluid o zmiennych zaimkach'),
    new Book('Rick Riordan', 'Statek umarłych', '', 2017, [], 'postać genderfluid o zmiennych zaimkach'),

    // inne
    new Book('Marta Magdalena Lasik', 'Zwierciadło w dziurce od klucza', 'w: „Skafander i melonik”', 2018),
];

// „”
