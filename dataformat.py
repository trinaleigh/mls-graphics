# get 2016 MLS regular season data

from urllib.request import urlopen

data = urlopen('https://raw.githubusercontent.com/openfootball/major-league-soccer/master/2016/mls.txt')
records = []
for line in data:
    records.append(line.decode('utf-8'))  # convert from byte object to str


def reformat(gameList):
    """
    parses raw data
    returns a dictionary where the key is the game number
    the value is a nested dictionary containing:
        home team
        home team score
        away team
        away team score
    """
    recordDict = {}

    i = 0
    for game in gameList:
        # ignore lines that have no dash (blank lines or week headers)
        if '-' not in game:
            pass
        # otherwise, line format = Date Home Team Score-Score Away Team
        # first find the dash
        # then split items using the date and the line end as bookends
        else:
            breakpt = game.index('-')
            home = game[7:breakpt-2]
            homeScore = int(game[breakpt-1])
            away = game[breakpt+3:-1]
            awayScore = int(game[breakpt+1])
            recordDict[i] = {'home':home, 'homeScore':homeScore, 'away':away, 'awayScore':awayScore}
            i += 1

    return recordDict


def season(team, recordDict):
    """
    takes in a dictionary representing all games
    returns a win-loss-draw record for the given team name
    output is a list of point values where 0 represents a loss, 1 represents a draw, and 3 represents a win
    """
    outcomeList = []

    for gameNum, game in recordDict.items():
        if team == game['home']:
            outcome = (3 if game['homeScore'] > game['awayScore'] else (1 if game['homeScore'] == game['awayScore'] else 0))
            outcomeList.append(outcome)
        elif team == game['away']:
            outcome = (3 if game['homeScore'] < game['awayScore'] else (1 if game['homeScore'] == game['awayScore'] else 0))
            outcomeList.append(outcome)
        # if team did not play in this game, ignore
        else:
            pass

    return outcomeList


def stringFormat(teamList):
    """
    formats win-loss-draw record for csv
    """
    writeList = str(teamList)
    writeList = writeList.replace("[", "").replace("]", "")
    return writeList


# TESTS
# # get and copy data
# print(records)
# testLine = records[5]
# print(testLine)
#
# # parse data
# print(reformat(records))
#
# # compute season
# allGames = reformat(records)
# phillyRecord = season("Philadelphia Union", allGames)
# print(phillyRecord)
# print(len(phillyRecord))  # length should be 34 for the 2016 season
#
# write to file
file = open("data.txt", "w")
allGames = reformat(records)
phillyRecord = stringFormat(season("Philadelphia Union", allGames))
file.write(phillyRecord)
file.close()
