function renderRequire(container, value) {
  //code
  container.innerHTML = value
    .map(
      (item) =>
        `<div class="require-item">
        <img src="../../assets/icons/ok.svg" alt="ok" />
        <span id="require-container">
            ${item}
        </span>
    </div>`
    )
    .join('');
}
