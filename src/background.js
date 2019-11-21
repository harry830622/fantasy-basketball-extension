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

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    const { type, payload } = msg;
    switch (type) {
      case 'INIT': {
        const { leagueId } = payload;
        fetch(`${baseUrl}/${leagueId}`)
          .then(res => res.text())
          .then(html => {
            const domParser = new DOMParser();
            const doc = domParser.parseFromString(html, 'text/html');
            const matchupHrefs = [
              ...doc.querySelectorAll('#matchupweek ul > li'),
            ].map(n => n.getAttribute('data-target'));
            console.log(matchupHrefs);
            const teamIds = [
              ...doc.querySelectorAll('#matchupweek ul > li a.F-link'),
            ].map(n => n.getAttribute('href').split('/')[3]);
            console.log(teamIds);
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
