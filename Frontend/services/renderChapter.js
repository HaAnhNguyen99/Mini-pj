function renderChapter(container, chapters) {
  let chapterCount = 0,
    lessionCount = 0,
    durationCount = 0;
  const body = document.createElement('div');

  body.innerHTML = chapters
    .map((chapter, i) => {
      chapterCount += 1;
      lessionCount += chapter.lessions.length;
      durationCount += chapter.lessions.reduce(
        (sum, lession) => sum + lession.duration,
        0
      );

      return `
        <div class="panel">
          <div class="panel-header">
            <strong>${i + 1}. ${chapter.chapter_title}</strong>
            <p>
              <span>${chapter.lessions.length}</span>
              <span>Bài học</span>
            </p>
          </div>

          <div class="panel-body collapse">
            ${chapter.lessions
              .map(
                (lession, index) => `
                <div class="panel-item">
                  <div>
                    <img src="../../assets/icons/play.svg" alt="" />
                    <span>${index + 1}. ${lession.lession_title}</span>
                  </div>
                  <p>
                    <span>${convertSeconds(lession.duration).minutes}:${
                  convertSeconds(lession.duration).seconds >= 10
                    ? convertSeconds(lession.duration).seconds
                    : `0${convertSeconds(lession.duration).seconds}`
                }</span>
                  </p>
                </div>`
              )
              .join('')}
          </div>
        </div>`;
    })
    .join('');

  container.appendChild(body);
  return { chapterCount, lessionCount, durationCount };
}
