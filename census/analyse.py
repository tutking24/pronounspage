from typing import Union, List
import pandas as pd
from pathlib import Path
import plotly.express as px
import plotly.io as pio
import os
from datetime import datetime
import json
from argparse import ArgumentParser
import shutil

year = datetime.now().year
projectDir = Path(__file__).parent
inputDir = projectDir / 'input'
outputDir = projectDir.parent / 'locale' / 'pl' / 'docs' / ('spis-%s' % year)   # projectDir / 'output'
openFigs = False
colours = ['#c71585']
colours_multi = ['#c71585', '#8b0f7a', '#15c79c']
pd.options.mode.chained_assignment = None
fontFamily = 'Nunito, "Open Sans", sans-serif'
graphHead = '''
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500&display=swap" rel="stylesheet">
'''

def extractQuestion(
        df: pd.DataFrame,
        questionNumber: int,
        includeAnswers: bool = True,
        includeAggregates: bool = False,
        removeUnderscores: bool = True
    ) -> pd.Series:
    print('Extracting question', questionNumber)
    questionDf = df.filter(regex='^%s_%s(?!_writein)' % (
        questionNumber,
        ('' if includeAnswers else 'aggr_') if includeAggregates else '(?!aggr)'
    ))
    questionDf.columns = [
        c[len(str(questionNumber)) + 1:]
            .replace('aggr_', 'łącznie: ')
            .replace('_', ' ' if removeUnderscores else '_')
            .replace('łącznie: trans_', 'łącznie: trans*')
        for c in questionDf.columns
    ]
    questionDf = questionDf.sum()
    questionDf = questionDf.apply(lambda x: round(100 * x / len(df), 1))

    return questionDf


def extractQuestionSingle(
        df: pd.DataFrame,
        questionNumber: int,
        includeAnswers: bool = True,
        includeAggregates: bool = False
    ) -> pd.Series:
    print('Extracting question', questionNumber)
    questionDf = df.filter(regex='^%s_%s(?!_writein)' % (
        questionNumber,
        ('' if includeAnswers else 'aggr_') if includeAggregates else '(?!aggr)'
    ))
    questionDf = questionDf.groupby(f'{questionNumber}_')[f'{questionNumber}_'].count()
    questionDf = questionDf.apply(lambda x: round(100 * x / len(df), 1))

    return questionDf


def renameIndex(data: Union[pd.DataFrame, pd.Series], new_index: List[str]) -> Union[pd.DataFrame, pd.Series]:
    if type(data) is pd.Series:
        data = data.copy()
        data.columns = new_index
        data.index = new_index
        return data

    return data.set_axis(labels=new_index, axis=0)


def generateBar(
        data: Union[pd.DataFrame, pd.Series],
        group: str,
        name: str,
        title: str,
        show: bool = False
    ):
    print('Generating graph', group, name)
    is_multi = type(data) is pd.DataFrame and len(data.columns) > 1

    if all([type(c) is str and c.startswith('łącznie: ') for c in data.index]):
        data = renameIndex(data, [c.replace('łącznie: ', '') for c in data.index])

    if 'nic, używam imienia nadanego mi przez rodziców' in data.index:
        data = renameIndex(data, [
            'nadane – ale przeciwna płeć',
            'nadane – ale wersja unisex',
            'nadane – bez zmian',
            'wybrane – rzeczownik',
            'wybrane – binarne',
            'wybrane – unisex',
        ])

    fig = px.bar(
        data,
        color_discrete_sequence=colours_multi if is_multi else colours,
        barmode='group',
        template='plotly_white',
    )
    fig.update_layout(
        showlegend=is_multi,
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1, title=''),
        title=title,
        xaxis=None,
        yaxis=None,
        font=dict(family=fontFamily, size=14),
    )
    for trace in fig.select_traces():
        trace.update(
            hovertemplate='%{x}<br>%{y:.2f}%' + ('<br>%{meta}' if is_multi else '') + '<extra></extra>',
            meta=trace.offsetgroup,
            hoverlabel_font=dict(family=fontFamily, size=12),
        )

    file_path = outputDir / group / (name + '.html')
    pio.write_html(fig, file=file_path, auto_open=show or openFigs, include_plotlyjs='cdn')

    with open(file_path, 'r') as fr:
        content = fr.read().replace('</head>', graphHead + '</head>')
        with open(file_path, 'w') as fw:
            fw.write(content)


def percent(value: int, size: int, precision: int = 2) -> float:
    return round(100 * value / size, precision)


def ensureEmptyDir(dir: Path) -> Path:
    if os.path.exists(dir):
        shutil.rmtree(dir)
    os.makedirs(dir, exist_ok=True)


def analyse(group: str, df: pd.DataFrame, echo: bool = False, diffs: List[str] = None):
    ensureEmptyDir(outputDir / group)

    df_plural = df[df['7_aggr_mnogie'] == 1]
    df_neuter = df[df['7_rodzaj neutralny'] == 1]

    stats = {
        'size': len(df),
        'size_plural': len(df_plural),
        'size_neuter': len(df_neuter),
        'age': pd.Series(buildAgesHistogram(df)),
        'ageStats': {
            'avg': round(df['age'].mean(), 1),
            'median': round(df['age'].median(), 1),
            'std': round(df['age'].std(), 1),
            'under_30': percent(len(df[df['age'] < 30]), len(df)),
            'adults': percent(len(df[df['age'] >= 18]), len(df)),
            'over_30': percent(len(df[df['age'] >= 30]), len(df)),
            'under_30_count': len(df[df['age'] < 30]),
            'adults_count': len(df[df['age'] >= 18]),
            'over_30_count': len(df[df['age'] >= 30]),
        },
        'neuter': extractQuestionSingle(df, 6),
        'neuterByUsers': extractQuestionSingle(df_neuter, 6),
        'pronounGroups': extractQuestion(df, 7),
        'pronounGroupsAggr': extractQuestion(df, 7, includeAnswers=False, includeAggregates=True),
        'pluralNouns': extractQuestionSingle(df_plural, 8),
        'pluralNonGendered': extractQuestionSingle(df_plural, 9),
        'pronouns': extractQuestion(df, 10),
        'pronounsAggr': extractQuestion(df, 10, includeAnswers=False, includeAggregates=True),
        'nouns': extractQuestion(df, 11),
        'honorifics': extractQuestion(df, 12, includeAggregates=True),
        'obstacles': extractQuestion(df, 13),
        'groups': extractQuestion(df, 14),
        'reasons': extractQuestion(df, 15),
        'names': extractQuestionSingle(df, 16),
        'namesAggr': extractQuestion(df, 16, includeAnswers=False, includeAggregates=True),
        'english': extractQuestion(df, 17, includeAggregates=True),
        'labelsGender': extractQuestion(df, 18, includeAggregates=True, removeUnderscores=False),
        'labelsSexuality': extractQuestion(df, 19, includeAggregates=True, removeUnderscores=False),
    }

    stats_json = {
        k: v.to_dict() if type(v) is pd.Series else v
        for k, v
        in stats.items()
    }

    stats_json['diff'] = {}
    for prev_year in (diffs or []):
        with open(outputDir.parent / prev_year / group / 'stats.json', 'r') as f:
            prev_stats = json.load(f)
            stats_json['diff'][prev_year] = {}
            for k, v in stats_json.items():
                if type(v) != dict or k == 'diff' or k not in prev_stats:
                    continue
                stats_json['diff'][prev_year][k] = {}
                for kk, vv in v.items():
                    if kk not in prev_stats[k]:
                        continue
                    stats_json['diff'][prev_year][k][kk] = round(vv - prev_stats[k][kk], 1)

    stats_json = json.dumps(stats_json, indent=4)

    if echo:
        print('--- Group: %s ---' % group)
        print(stats_json)

    with open(outputDir / group / 'stats.json', 'w') as f:
        f.write(stats_json)

    return stats


def buildAgesHistogram(df: pd.DataFrame) -> pd.Series:
    ages = [int(a) for a in df['age'].to_list() if a > 0]
    agesHist = {i: 0 for i in range(min(ages), max(ages) + 1)}
    for age in ages:
        agesHist[age] += 1
    s = len(ages)

    return pd.Series({
        age: percent(count, s, 3)
        for age, count
        in agesHist.items()
    })


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-s', '--show', dest='show', default=False, nargs='?', const=True)
    parser.add_argument('-e', '--echo', dest='echo', default=False, nargs='?', const=True)
    args = parser.parse_args()

    if args.show:
        openFigs = True

    df = pd.read_csv(inputDir / 'export.csv')
    df = df[df['0_'].isin(['osobą niebinarną', 'nie wiem'])]
    df.loc[:, 'age'] = year - df['3_']
    df.loc[df['age'] > 100, 'age'] = None

    diffs = ['spis-2022']

    print(df)

    stats = {
        'general': analyse('general', df, args.echo, diffs),
        'location_poland': analyse('location_poland', df[df['4_'] == 'w Polsce'], args.echo, diffs),
        'location_abroad': analyse('location_abroad', df[df['4_'] == 'za granicą'], args.echo, diffs),
        'agab_f': analyse('agab_f', df[df['1_'] == 'żeńską'], args.echo, diffs),
        'agab_m': analyse('agab_m', df[df['1_'] == 'męską'], args.echo, diffs),
        # 'agab_x': analyse('agab_x', df[df['1_'] == 'inną (w jurysdykcjach, gdzie to możliwe)'], args.echo, diffs),
    }

    comparisons = {
        'by_location': {
            'general': 'Ogół',
            'location_poland': 'Polska',
            'location_abroad': 'Zagranica',
        },
        'by_agab': {
            'general': 'Ogół',
            'agab_f': 'AFAB',
            'agab_m': 'AMAB',
        },
    }

    graphs = {
        'age': 'Wiek osób respondenckich',
        'neuter': 'Preferowana nazwa rodzaju gramatycznego',
        'neuterByUsers': 'Preferowana nazwa rodzaju gramatycznego wśród osób go używających',
        'pronounGroups': 'Rodzaj gramatyczny używany w mowie',
        'pronouns': 'Zaimki używane w piśmie',
        'pluralNouns': 'Czy rzeczowniki również w liczbie mnogiej?',
        'pluralNonGendered': 'Czy nieupłciowione formy również w liczbie mnogiej?',
        'pronounsAggr': 'Zaimki używane w piśmie (zgrupowane)',
        'nouns': 'Rzeczowniki',
        'honorifics': 'Formy grzecznościowe',
        'obstacles': 'Dlaczego nie formy niebinarne?',
        'reasons': 'Co wpływa na wybór form?',
        'groups': 'Formy do opisu grup mieszanych',
        'names': 'Używane imię',
        'english': 'Zaimki w języku angielskim',
        'labelsGender': 'Etykietki opisujące płeć',
        'labelsSexuality': 'Etykietki opisujące orientację seksualną',
    }

    for group, group_stats in stats.items():
        for graph, graph_label in graphs.items():
            generateBar(group_stats[graph], group, graph, graph_label)

    for comparison_key, comparison_groups in comparisons.items():
        ensureEmptyDir(outputDir / comparison_key)
        for graph, graph_label in graphs.items():
            data = pd.DataFrame({
                groupLabel: stats[group][graph]
                for group, groupLabel
                in comparison_groups.items()
            })
            generateBar(data, comparison_key, graph, graph_label)
