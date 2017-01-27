# get 2016 MLS regular season data

from urllib.request import urlopen

def getData():
    data = urlopen('https://raw.githubusercontent.com/openfootball/major-league-soccer/master/2016/mls.txt')
    records = []

    for line in data:
        records.append(line.decode('utf-8'))  # convert from byte object to str

    return records


def reformat(gameList):
    """
    parses raw data
    returns:
        1) a dictionary where the key is the game number
        the value is a nested dictionary containing:
            home team
            home team score
            away team
            away team score
        2) a list of all unique team names
    """
    recordDict = {}
    teamList = []

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
            # add team names to the team list
            if home not in teamList:
                teamList.append(home)
            i += 1

    # alphabetical order
    teamList.sort()

    return recordDict, teamList


def season(team, recordDict):
    """
    takes in a dictionary of games
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

def writeCSV(recordDict, teamList, filename):
    """
    takes in a dictionary of games and a list of teams include in CSV
    writes win-loss-draw record to CSV
    """
    file = open(filename, "w")

    # get the full record for each team
    byTeam = []
    for team in teamList:
        byTeam.append(season(team, recordDict))

    # zip to rearrange from teams to weeks (for CSV rows)
    byWeek = list(zip(*byTeam))

    # write to CSV
    # remove brackets, quotes, extra spaces
    # header is the list of teams
    # following lines include win-loss-draw by week
    file.write('Week,' + str(teamList).replace('[', '').replace(']', '').replace("'", "").replace(', ', ',') + '\n')

    i = 1
    for week in byWeek:
        file.write(str(i) + ',' + str(week).replace('(', '').replace(')', '').replace(', ', ',')  + '\n')
        i += 1

    file.close()

def initialize():
    records = getData()
    allGames, allTeams = reformat(records)
    writeCSV(allGames, allTeams, "data.txt")

initialize()

# # TESTS
# # get and copy data
# records = getData()
# print(records)
# testLine = records[5]
# print(testLine)
#
# # parse data
# print(reformat(records))
#
# # compute season
# allGames, allTeams = reformat(records)
# phillyRecord = season("Philadelphia Union", allGames)
# print(phillyRecord)
# print(len(phillyRecord))  # length should be 34 for the 2016 season
#
# #CSV
# records = getData()
# allGames, allTeams = reformat(records)
# print(len(allTeams))  # length should be 20 for the 2016 season#
# writeCSV(allGames, allTeams, "data.txt")