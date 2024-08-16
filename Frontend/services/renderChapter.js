function renderChapter(container, chapters) {
  let chapterCount = 0,
    lessionCount = 0;
  const durationList = [];
  let durationCount;

  const body = document.createElement('div');
  // console.log(chapters[0].lessons[0].duration);

  durationCount = sumTimes(durationList);

  body.innerHTML = chapters
    .map((chapter, i) => {
      chapterCount += 1;
      lessionCount += chapter.lessons.length;

      chapter.lessons.forEach((lesson) => {
        durationList.push(lesson.duration);
      });

      durationCount = sumTimes(durationList);

      return `
        <div class="panel">
          <div class="panel-header">
            <strong>${i + 1}. ${chapter.chapter_title}</strong>
            <p>
              <span>${chapter.lessons.length}</span>
              <span>Bài học</span>
            </p>
          </div>

          <div class="panel-body collapse">
            ${chapter.lessons
              .map(
                (lesson, index) => `
                <div class="panel-item">
                  <div>
                    <img src="../../assets/icons/play.svg" alt="" />
                    <span>${index + 1}. ${lesson.lesson_title}</span>
                  </div>
                  <p>
                    <span>${lesson.duration}</span>
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
