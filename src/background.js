chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'basketball.fantasysports.yahoo.com',
              schemes: ['https'],
              pathSuffix: 'matchup',
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

const baseUrl = 'https://basketball.fantasysports.yahoo.com';

const toDoc = html => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(html, 'text/html');
  return doc;
};

const getDoc = url =>
  fetch(url)
    .then(res => res.text())
    .then(toDoc);

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    const { type, payload } = msg;
    switch (type) {
      case 'INIT': {
        const { leagueId } = payload;
        getDoc(`${baseUrl}/nba/${leagueId}`)
          .then(doc => {
            const matchupHrefs = [
              ...doc.querySelectorAll('#matchupweek ul > li'),
            ].map(n => n.getAttribute('data-target'));
            const teamIds = [
              ...doc.querySelectorAll('#matchupweek ul > li a.F-link'),
            ].map(n => n.getAttribute('href').split('/')[3]);
            return Promise.all([
              Promise.all(
                teamIds.map(teamId =>
                  getDoc(`${baseUrl}/nba/${leagueId}/${teamId}`).then(doc => {
                    const teamDiv = doc.querySelector('#team-card-info');
                    const teamName = teamDiv.querySelector(
                      `a[href="/nba/${leagueId}/${teamId}/team"]`,
                    ).innerText;
                    const teamUser = teamDiv.querySelector(
                      'a[href^="https://profiles.sports.yahoo.com/user/"]',
                    ).innerText;
                    const teamStanding = teamDiv
                      .querySelector('ul.team-card-stats em')
                      .innerText.split(' ')[0];
                    const teamRecord = teamDiv.querySelector(
                      'ul.team-card-stats span',
                    ).innerText;
                    const teamAvatarUrl = teamDiv
                      .querySelector('img[class*="Avatar"]')
                      .getAttribute('src');
                    return {
                      [teamId]: {
                        name: teamName,
                        user: teamUser,
                        standing: teamStanding,
                        record: teamRecord,
                        avatarUrl: teamAvatarUrl,
                      },
                    };
                  }),
                ),
              ),
              Promise.all(
                matchupHrefs.map(matchupHref =>
                  getDoc(`${baseUrl}${matchupHref}`).then(doc => {
                    const matchupWallHeader = doc.querySelector(
                      '#matchup-wall-header',
                    );
                    const team1Row = matchupWallHeader.querySelector(
                      'tbody tr:nth-child(1)',
                    );
                    const team1Id = team1Row
                      .querySelector('td:nth-child(1) span > a')
                      .getAttribute('href')
                      .split('/')[3];
                    const team1Fgp = window.parseFloat(
                      team1Row.querySelector('td:nth-child(3) div').innerText,
                    );
                    const team1Ftp = window.parseFloat(
                      team1Row.querySelector('td:nth-child(5) div').innerText,
                    );
                    const team1Tptm = window.parseInt(
                      team1Row.querySelector('td:nth-child(6) div').innerText,
                    );
                    const team1Pts = window.parseInt(
                      team1Row.querySelector('td:nth-child(7) div').innerText,
                    );
                    const team1Reb = window.parseInt(
                      team1Row.querySelector('td:nth-child(8) div').innerText,
                    );
                    const team1Ast = window.parseInt(
                      team1Row.querySelector('td:nth-child(9) div').innerText,
                    );
                    const team1Stl = window.parseInt(
                      team1Row.querySelector('td:nth-child(10) div').innerText,
                    );
                    const team1Blk = window.parseInt(
                      team1Row.querySelector('td:nth-child(11) div').innerText,
                    );
                    const team1To = window.parseInt(
                      team1Row.querySelector('td:nth-child(12) div').innerText,
                    );
                    const team2Row = matchupWallHeader.querySelector(
                      'tbody tr:nth-child(2)',
                    );
                    const team2Id = team2Row
                      .querySelector('td:nth-child(1) span > a')
                      .getAttribute('href')
                      .split('/')[3];
                    const team2Fgp = window.parseFloat(
                      team2Row.querySelector('td:nth-child(3) div').innerText,
                    );
                    const team2Ftp = window.parseFloat(
                      team2Row.querySelector('td:nth-child(5) div').innerText,
                    );
                    const team2Tptm = window.parseInt(
                      team2Row.querySelector('td:nth-child(6) div').innerText,
                    );
                    const team2Pts = window.parseInt(
                      team2Row.querySelector('td:nth-child(7) div').innerText,
                    );
                    const team2Reb = window.parseInt(
                      team2Row.querySelector('td:nth-child(8) div').innerText,
                    );
                    const team2Ast = window.parseInt(
                      team2Row.querySelector('td:nth-child(9) div').innerText,
                    );
                    const team2Stl = window.parseInt(
                      team2Row.querySelector('td:nth-child(10) div').innerText,
                    );
                    const team2Blk = window.parseInt(
                      team2Row.querySelector('td:nth-child(11) div').innerText,
                    );
                    const team2To = window.parseInt(
                      team2Row.querySelector('td:nth-child(12) div').innerText,
                    );
                    const teamStatById = {
                      [team1Id]: {
                        fgp: team1Fgp,
                        ftp: team1Ftp,
                        tptm: team1Tptm,
                        pts: team1Pts,
                        reb: team1Reb,
                        ast: team1Ast,
                        stl: team1Stl,
                        blk: team1Blk,
                        to: team1To,
                      },
                      [team2Id]: {
                        fgp: team2Fgp,
                        ftp: team2Ftp,
                        tptm: team2Tptm,
                        pts: team2Pts,
                        reb: team2Reb,
                        ast: team2Ast,
                        stl: team2Stl,
                        blk: team2Blk,
                        to: team2To,
                      },
                    };
                    return teamStatById;
                  }),
                ),
              ),
            ])
              .then(([teams, stats]) => ({
                teamById: teams.reduce(
                  (prev, curr) => ({ ...prev, ...curr }),
                  {},
                ),
                teamStatById: stats.reduce(
                  (prev, curr) => ({ ...prev, ...curr }),
                  {},
                ),
              }))
              .then(data => {
                port.postMessage({ type: 'DATA', payload: data });
              });
          })
          .catch(console.log);
        break;
      }
      default: {
        break;
      }
    }
  });
});
