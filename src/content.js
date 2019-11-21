const port = chrome.runtime.connect();

const leagueId = window.location.pathname.split('/')[2];

port.postMessage({ type: 'INIT', payload: { leagueId } });

// port.onMessage.addEventListener(msg => {
//   console.log(msg);

//   const matchupHeader = document.querySelector('#matchup-header');

//   const meDiv = matchupHeader.querySelector('.Grid-u-1-3:nth-child(1)');
//   const meHref = meDiv.querySelector('a.F-link').getAttribute('href');

//   const opponentDiv = matchupHeader.querySelector('.Grid-u-1-3:nth-child(3)');
//   const opponentHref = opponentDiv
//     .querySelector('a.F-link')
//     .getAttribute('href');

//   const numTeams = 10;

//   const prevTeamArrowBtn = document.createElement('button');
//   prevTeamArrowBtn.innerHTML = '<';
//   const nextTeamArrowBtn = document.createElement('button');
//   nextTeamArrowBtn.innerHTML = '>';
//   opponentDiv.prepend(prevTeamArrowBtn);
//   opponentDiv.append(nextTeamArrowBtn);

//   let currOpponentNum = window.parseInt(opponentHref.split('/')[3]);
//   prevTeamArrowBtn.addEventListener('click', () => {
//     currOpponentNum -= 1;
//     currOpponentNum = Math.max(currOpponentNum, 1);
//     const prevTeamPath = `${opponentHref
//       .split('/')
//       .slice(0, 3)
//       .join('/')}/${currOpponentNum}`;
//     fetch(prevTeamPath).then(console.log);
//   });
// });
