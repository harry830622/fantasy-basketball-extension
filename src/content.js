const port = chrome.runtime.connect();

const leagueId = window.location.pathname.split('/')[2];

port.postMessage({ type: 'INIT', payload: { leagueId } });

port.onMessage.addListener(msg => {
  const { type, payload } = msg;
  switch (type) {
    case 'DATA': {
      const teamIds = Object.keys(payload.teamById);

      const matchupHeader = document.querySelector('#matchup-header');

      const meDiv = matchupHeader.querySelector('.Grid-u-1-3:nth-child(1)');
      const meHref = meDiv.querySelector('a.F-link').getAttribute('href');
      const meId = meHref.split('/')[3];

      const opponentIds = teamIds.filter(id => id !== meId);

      const opponentDiv = matchupHeader.querySelector(
        '.Grid-u-1-3:nth-child(3)',
      );
      const opponentAvatarImg = opponentDiv.querySelector(
        'img[class*="Avatar"]',
      );
      const opponentNameA = opponentDiv.querySelector('a.F-link');
      const opponentHref = opponentNameA.getAttribute('href');
      const opponentUserSpan = opponentDiv.querySelector('span.user-id');
      const opponentRecordDiv = opponentDiv.querySelector(
        '.Grid-u:nth-child(2) > :last-child',
      );

      const matchupWallHeader = document.querySelector('#matchup-wall-header');

      const meRow = matchupWallHeader.querySelector('tbody tr:nth-child(1)');
      const meFgpTd = meRow.querySelector('td:nth-child(3)');
      const meFtpTd = meRow.querySelector('td:nth-child(5)');
      const meTptmTd = meRow.querySelector('td:nth-child(6)');
      const mePtsTd = meRow.querySelector('td:nth-child(7)');
      const meRebTd = meRow.querySelector('td:nth-child(8)');
      const meAstTd = meRow.querySelector('td:nth-child(9)');
      const meStlTd = meRow.querySelector('td:nth-child(10)');
      const meBlkTd = meRow.querySelector('td:nth-child(11)');
      const meToTd = meRow.querySelector('td:nth-child(12)');

      const opponentRow = matchupWallHeader.querySelector(
        'tbody tr:nth-child(2)',
      );
      const opponentRowNameA = opponentRow.querySelector(
        'td:nth-child(1) span > a',
      );
      const opponentRowAvatarImg = opponentRow.querySelector(
        'td:nth-child(1) img',
      );
      const opponentFgpTd = opponentRow.querySelector('td:nth-child(3)');
      const opponentFtpTd = opponentRow.querySelector('td:nth-child(5)');
      const opponentTptmTd = opponentRow.querySelector('td:nth-child(6)');
      const opponentPtsTd = opponentRow.querySelector('td:nth-child(7)');
      const opponentRebTd = opponentRow.querySelector('td:nth-child(8)');
      const opponentAstTd = opponentRow.querySelector('td:nth-child(9)');
      const opponentStlTd = opponentRow.querySelector('td:nth-child(10)');
      const opponentBlkTd = opponentRow.querySelector('td:nth-child(11)');
      const opponentToTd = opponentRow.querySelector('td:nth-child(12)');
      const opponentFgpDiv = opponentRow.querySelector('td:nth-child(3) div');
      const opponentFtpDiv = opponentRow.querySelector('td:nth-child(5) div');
      const opponentTptmDiv = opponentRow.querySelector('td:nth-child(6) div');
      const opponentPtsDiv = opponentRow.querySelector('td:nth-child(7) div');
      const opponentRebDiv = opponentRow.querySelector('td:nth-child(8) div');
      const opponentAstDiv = opponentRow.querySelector('td:nth-child(9) div');
      const opponentStlDiv = opponentRow.querySelector('td:nth-child(10) div');
      const opponentBlkDiv = opponentRow.querySelector('td:nth-child(11) div');
      const opponentToDiv = opponentRow.querySelector('td:nth-child(12) div');

      meFgpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meFtpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meTptmTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      mePtsTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meRebTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meAstTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meStlTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meBlkTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      meToTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentFgpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentFtpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentTptmTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentPtsTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentRebTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentAstTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentStlTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentBlkTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
      opponentToTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');

      let currOpponentIdx = opponentIds.findIndex(
        id => id === opponentHref.split('/')[3],
      );

      const prevTeamArrowBtn = document.createElement('button');
      prevTeamArrowBtn.innerHTML = '<';
      const nextTeamArrowBtn = document.createElement('button');
      nextTeamArrowBtn.innerHTML = '>';
      opponentDiv.prepend(prevTeamArrowBtn);
      opponentDiv.append(nextTeamArrowBtn);

      prevTeamArrowBtn.addEventListener('click', () => {
        currOpponentIdx -= 1;
        if (currOpponentIdx === -1) {
          currOpponentIdx = opponentIds.length - 1;
        }
        const currOpponentId = opponentIds[currOpponentIdx];
        const currOpponent = payload.teamById[currOpponentId];
        opponentAvatarImg.setAttribute('src', currOpponent.avatarUrl);
        opponentNameA.innerHTML = currOpponent.name;
        opponentNameA.setAttribute(
          'href',
          `/nba/${leagueId}/${currOpponentId}`,
        );
        opponentUserSpan.innerHTML = currOpponent.user;
        opponentRecordDiv.innerHTML = `${currOpponent.record} | ${currOpponent.standing}`;
        opponentRowAvatarImg.setAttribute('src', currOpponent.avatarUrl);
        opponentRowNameA.innerHTML = currOpponent.name;
        opponentRowNameA.setAttribute(
          'href',
          `/nba/${leagueId}/${currOpponentId}`,
        );
        const currOpponentStat = payload.teamStatById[currOpponentId];
        opponentFgpDiv.innerHTML = currOpponentStat.fgp.toString().slice(1);
        opponentFtpDiv.innerHTML = currOpponentStat.ftp.toString().slice(1);
        opponentTptmDiv.innerHTML = currOpponentStat.tptm;
        opponentPtsDiv.innerHTML = currOpponentStat.pts;
        opponentRebDiv.innerHTML = currOpponentStat.reb;
        opponentAstDiv.innerHTML = currOpponentStat.ast;
        opponentStlDiv.innerHTML = currOpponentStat.stl;
        opponentBlkDiv.innerHTML = currOpponentStat.blk;
        opponentToDiv.innerHTML = currOpponentStat.to;
      });

      break;
    }
    default: {
      break;
    }
  }
});
