const port = chrome.runtime.connect();

const leagueId = window.location.pathname.split('/')[2];

port.postMessage({ type: 'INIT', payload: { leagueId } });

port.onMessage.addListener(msg => {
  const { type, payload } = msg;
  switch (type) {
    case 'DATA': {
      const { teamById, teamStatById } = payload;

      const matchupHeader = document.querySelector('#matchup-header');

      const meDiv = matchupHeader.querySelector('.Grid-u-1-3:nth-child(1)');
      const meHref = meDiv.querySelector('a.F-link').getAttribute('href');
      const meId = meHref.split('/')[3];

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

      const meHeaderScoreTd = matchupHeader.querySelector(
        '.Grid-u-1-3:nth-child(2) td:nth-child(1)',
      );
      const opponentHeaderScoreTd = matchupHeader.querySelector(
        '.Grid-u-1-3:nth-child(2) td:nth-child(3)',
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
      const meScoreTd = meRow.querySelector('td:nth-child(13)');
      const meScoreDiv = meRow.querySelector('td:nth-child(13) div');

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
      const opponentScoreTd = opponentRow.querySelector('td:nth-child(13)');
      const opponentFgpDiv = opponentRow.querySelector('td:nth-child(3) div');
      const opponentFtpDiv = opponentRow.querySelector('td:nth-child(5) div');
      const opponentTptmDiv = opponentRow.querySelector('td:nth-child(6) div');
      const opponentPtsDiv = opponentRow.querySelector('td:nth-child(7) div');
      const opponentRebDiv = opponentRow.querySelector('td:nth-child(8) div');
      const opponentAstDiv = opponentRow.querySelector('td:nth-child(9) div');
      const opponentStlDiv = opponentRow.querySelector('td:nth-child(10) div');
      const opponentBlkDiv = opponentRow.querySelector('td:nth-child(11) div');
      const opponentToDiv = opponentRow.querySelector('td:nth-child(12) div');
      const opponentScoreDiv = opponentRow.querySelector(
        'td:nth-child(13) div',
      );

      const teamIds = Object.keys(teamById);
      const opponentIds = teamIds.filter(id => id !== meId);
      let currOpponentIdx = opponentIds.findIndex(
        id => id === opponentHref.split('/')[3],
      );

      const prevTeamArrowBtn = document.createElement('button');
      prevTeamArrowBtn.innerHTML = '<';
      const nextTeamArrowBtn = document.createElement('button');
      nextTeamArrowBtn.innerHTML = '>';
      opponentDiv.prepend(prevTeamArrowBtn);
      opponentDiv.append(nextTeamArrowBtn);

      const populateStat = opponentId => {
        const currOpponent = teamById[opponentId];
        opponentAvatarImg.setAttribute('src', currOpponent.avatarUrl);
        opponentNameA.innerHTML = currOpponent.name;
        opponentNameA.setAttribute('href', `/nba/${leagueId}/${opponentId}`);
        opponentUserSpan.innerHTML = currOpponent.user;
        opponentRecordDiv.innerHTML = `${currOpponent.record} | ${currOpponent.standing}`;
        opponentRowAvatarImg.setAttribute('src', currOpponent.avatarUrl);
        opponentRowNameA.innerHTML = currOpponent.name;
        opponentRowNameA.setAttribute('href', `/nba/${leagueId}/${opponentId}`);
        const currOpponentStat = teamStatById[opponentId];
        opponentFgpDiv.innerHTML = currOpponentStat.fgp
          .toFixed(3)
          .toString()
          .slice(1);
        opponentFtpDiv.innerHTML = currOpponentStat.ftp
          .toFixed(3)
          .toString()
          .slice(1);
        opponentTptmDiv.innerHTML = currOpponentStat.tptm;
        opponentPtsDiv.innerHTML = currOpponentStat.pts;
        opponentRebDiv.innerHTML = currOpponentStat.reb;
        opponentAstDiv.innerHTML = currOpponentStat.ast;
        opponentStlDiv.innerHTML = currOpponentStat.stl;
        opponentBlkDiv.innerHTML = currOpponentStat.blk;
        opponentToDiv.innerHTML = currOpponentStat.to;

        meFgpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meFtpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meTptmTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        mePtsTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meRebTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meAstTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meStlTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meBlkTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meToTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        meScoreTd.classList.remove('Bg-selected');
        opponentFgpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentFtpTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentTptmTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentPtsTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentRebTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentAstTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentStlTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentBlkTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentToTd.classList.remove('Fw-b', 'Bg-shade2', 'Bg-selected');
        opponentScoreTd.classList.remove('Bg-selected');

        const meStat = teamStatById[meId];
        let meScore = 0;
        let opponentScore = 0;
        if (meStat.fgp > currOpponentStat.fgp) {
          meScore += 1;
          meFgpTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.fgp < currOpponentStat.fgp) {
          opponentScore += 1;
          opponentFgpTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.ftp > currOpponentStat.ftp) {
          meScore += 1;
          meFtpTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.ftp < currOpponentStat.ftp) {
          opponentScore += 1;
          opponentFtpTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.tptm > currOpponentStat.tptm) {
          meScore += 1;
          meTptmTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.tptm < currOpponentStat.tptm) {
          opponentScore += 1;
          opponentTptmTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.pts > currOpponentStat.pts) {
          meScore += 1;
          mePtsTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.pts < currOpponentStat.pts) {
          opponentScore += 1;
          opponentPtsTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.reb > currOpponentStat.reb) {
          meScore += 1;
          meRebTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.reb < currOpponentStat.reb) {
          opponentScore += 1;
          opponentRebTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.ast > currOpponentStat.ast) {
          meScore += 1;
          meAstTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.ast < currOpponentStat.ast) {
          opponentScore += 1;
          opponentAstTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.stl > currOpponentStat.stl) {
          meScore += 1;
          meStlTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.stl < currOpponentStat.stl) {
          opponentScore += 1;
          opponentStlTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.blk > currOpponentStat.blk) {
          meScore += 1;
          meBlkTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.blk < currOpponentStat.blk) {
          opponentScore += 1;
          opponentBlkTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        if (meStat.to < currOpponentStat.to) {
          meScore += 1;
          meToTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        } else if (meStat.to > currOpponentStat.to) {
          opponentScore += 1;
          opponentToTd.classList.add('Fw-b', 'Bg-shade2', 'Bg-selected');
        }
        meScoreDiv.innerHTML = meScore;
        opponentScoreDiv.innerHTML = opponentScore;
        meHeaderScoreTd.innerHTML = meScore;
        opponentHeaderScoreTd.innerHTML = opponentScore;
        if (meScore > opponentScore) {
          meScoreTd.classList.add('Bg-selected');
        } else if (meScore < opponentScore) {
          opponentScoreTd.classList.add('Bg-selected');
        }
      };

      prevTeamArrowBtn.addEventListener('click', () => {
        currOpponentIdx -= 1;
        if (currOpponentIdx === -1) {
          currOpponentIdx = opponentIds.length - 1;
        }
        const currOpponentId = opponentIds[currOpponentIdx];
        populateStat(currOpponentId);
      });
      nextTeamArrowBtn.addEventListener('click', () => {
        currOpponentIdx += 1;
        if (currOpponentIdx === opponentIds.length) {
          currOpponentIdx = 0;
        }
        const currOpponentId = opponentIds[currOpponentIdx];
        populateStat(currOpponentId);
      });

      break;
    }
    default: {
      break;
    }
  }
});
