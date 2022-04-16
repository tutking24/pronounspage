from typing import Union
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
colours_multi = ['#dd5fa6', '#8b0f7a', '#15c79c']
pd.options.mode.chained_assignment = None

def extractQuestion(
        df: pd.DataFrame,
        questionNumber: int,
        includeAnswers: bool = True,
        includeAggregates: bool = False,
        removeUnderscores: bool = True
    ) -> pd.Series:
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


def generateBar(
        data: Union[pd.DataFrame, pd.Series],
        group: str,
        name: str,
        title: str,
        show: bool = False
    ):
    is_multi = type(data) is pd.DataFrame and len(data.columns) > 1
    fig = px.bar(
        data,
        color_discrete_sequence=colours_multi if is_multi else colours,
        barmode='group',
    )
    fig.update_layout(
        showlegend=is_multi,
        legend=dict(orientation='h', yanchor='bottom', y=1.02, xanchor='right', x=1, title=''),
        title=title,
        xaxis=None,
        yaxis=None,
    )
    for trace in fig.select_traces():
        trace.update(
            hovertemplate='%{x}<br>%{y:.2f}%' + ('<br>%{meta}' if is_multi else '') + '<extra></extra>',
            meta=trace.offsetgroup
        )

    pio.write_html(fig, file=outputDir / group / (name + '.html'), auto_open=show or openFigs, include_plotlyjs='cdn')


def percent(value: int, size: int, precision: int = 2) -> float:
    return round(100 * value / size, precision)


def ensureEmptyDir(dir: Path) -> Path:
    if os.path.exists(dir):
        shutil.rmtree(dir)
    os.makedirs(dir, exist_ok=True)


def analyse(group: str, df: pd.DataFrame, echo: bool = False):
    ensureEmptyDir(outputDir / group)

    stats = {
        'size': len(df),
        'age': pd.Series(buildAgesHistogram(df)),
        'ageStats': {
            'avg': round(df['age'].mean(), 1),
            'median': round(df['age'].median(), 1),
            'std': round(df['age'].std(), 1),
            'under_30': percent(len(df[df['age'] < 30]), len(df)),
            'adults': percent(len(df[df['age'] >= 18]), len(df)),
        },
        'pronounGroups': extractQuestion(df, 6),
        'pronounGroupsAggr': extractQuestion(df, 6, includeAnswers=False, includeAggregates=True),
        'pronouns': extractQuestion(df, 7),
        'pronounsAggr': extractQuestion(df, 7, includeAnswers=False, includeAggregates=True),
        'nouns': extractQuestion(df, 8), 'honorifics': extractQuestion(df, 9, includeAggregates=True),
        'obstacles': extractQuestion(df, 10), 'reasons': extractQuestion(df, 12),
        'groups': extractQuestion(df, 11), 'english': extractQuestion(df, 13, includeAggregates=True),
        'labels': extractQuestion(df, 14, includeAggregates=True, removeUnderscores=False),
    }

    statsJson = json.dumps({
        k: v.to_dict() if type(v) is pd.Series else v
        for k, v
        in stats.items()
    }, indent=4)

    if echo:
        print('--- Group: %s ---' % group)
        print(statsJson)

    with open(outputDir / group / 'stats.json', 'w') as f:
        f.write(statsJson)

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

    stats = {
        'general': analyse('general', df, args.echo),
        'location_poland': analyse('location_poland', df[df['4_'] == 'w Polsce'], args.echo),
        'location_abroad': analyse('location_abroad', df[df['4_'] == 'za granicą'], args.echo),
        'agab_f': analyse('agab_f', df[df['1_'] == 'żeńską'], args.echo),
        'agab_m': analyse('agab_m', df[df['1_'] == 'męską'], args.echo),
        # 'agab_x': analyse('agab_x', df[df['1_'] == 'inną (w jurysdykcjach, gdzie to możliwe)'], args.echo),
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
        'pronounGroups': 'Rodzaj gramatyczny używany w mowie',
        'pronouns': 'Zaimki używane w mowie i piśmie',
        'pronounsAggr': 'Zaimki używane w mowie i piśmie (zgrupowane)',
        'nouns': 'Rzeczowniki',
        'honorifics': 'Formy grzecznościowe',
        'obstacles': 'Dlaczego nie formy niebinarne?',
        'reasons': 'Co wpływa na wybór form?',
        'groups': 'Formy do opisu grup mieszanych',
        'english': 'Zaimki w języku angielskim',
        'labels': 'Etykietki',
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
