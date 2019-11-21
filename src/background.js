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

const baseUrl = 'https://basketball.fantasysports.yahoo.com/nba';

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
        getDoc(`${baseUrl}/${leagueId}`)
          .then(doc => {
            const matchupHrefs = [
              ...doc.querySelectorAll('#matchupweek ul > li'),
            ].map(n => n.getAttribute('data-target'));
            console.log(matchupHrefs);
            const teamIds = [
              ...doc.querySelectorAll('#matchupweek ul > li a.F-link'),
            ].map(n => n.getAttribute('href').split('/')[3]);
            return Promise.all([
              Promise.all(
                teamIds.map(teamId =>
                  getDoc(`${baseUrl}/${leagueId}/${teamId}`).then(doc => {
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
                      id: teamId,
                      name: teamName,
                      user: teamUser,
                      standing: teamStanding,
                      record: teamRecord,
                      avatarUrl: teamAvatarUrl,
                    };
                  }),
                ),
              ),
            ])
              .then(([teams]) => ({
                teamById: teams.reduce(
                  (prev, curr) => ({ ...prev, [curr.id]: curr }),
                  {},
                ),
              }))
              .then(console.log);
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
